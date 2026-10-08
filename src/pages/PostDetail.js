import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiHeart, FiBookmark, FiClock, FiCalendar, FiShare2, FiCheck } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import { useBlog } from '../context/BlogContext';
import CommentSection from '../components/CommentSection';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import { formatPostDate, slugify } from '../utils/postUtils';
import './PostDetail.css';

/* ===== Reading Progress Bar ===== */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="reading-progress-bar" style={{ width: `${progress}%` }} />;
};

const renderInline = (text) => String(text).split(/(\*\*.*?\*\*)/g).map((part, index) => {
  if (part.startsWith('**') && part.endsWith('**')) {
    return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
  }

  return part;
});

const getHeadings = (content = '') => {
  const counts = {};
  let inCodeBlock = false;

  return content.split('\n').reduce((headings, line) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return headings;
    }

    const match = !inCodeBlock && line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) return headings;

    const text = match[2].trim();
    const base = slugify(text) || 'section';
    counts[base] = (counts[base] || 0) + 1;

    headings.push({
      id: `${base}-${counts[base]}`,
      text,
      level: match[1].length,
    });
    return headings;
  }, []);
};

/* ===== Share Button ===== */
const ShareButton = ({ title, onStatus }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        onStatus('Thanks for sharing this story.');
        return;
      }

      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onStatus('Link copied to your clipboard.');
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (error?.name !== 'AbortError') onStatus('Could not share this link. Please copy it from the address bar.', 'info');
    }
  };

  return (
    <motion.button
      type="button"
      className={`share-btn ${copied ? 'copied' : ''}`}
      onClick={handleShare}
      whileTap={{ scale: 0.95 }}
      aria-label="Share this article"
    >
      {copied ? <><FiCheck aria-hidden="true" /> Copied!</> : <><FiShare2 aria-hidden="true" /> Share</>}
    </motion.button>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, toggleLike, toggleBookmark, deletePost, showNotification } = useBlog();
  const post = posts.find(p => p.id === id);
  const headings = useMemo(() => getHeadings(post?.content), [post?.content]);

  if (!post) {
    return (
      <div className="post-detail-page">
        <EmptyState
          icon="📄"
          title="Post not found"
          message="The post you're looking for doesn't exist or has been removed."
          action={
            <Link to="/" className="empty-action-btn">
              Back to Home
            </Link>
          }
        />
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      navigate('/');
    }
  };

  const handleLike = () => {
    toggleLike(post.id);
    showNotification(post.isLiked ? 'Like removed.' : 'Thanks for showing this story some love.');
  };

  const handleBookmark = () => {
    toggleBookmark(post.id);
    showNotification(post.bookmarked ? 'Removed from your reading list.' : 'Saved to your reading list.');
  };

  const renderContent = (content) => {
    const parts = String(content || '').split('\\n');
    let inCodeBlock = false;
    let codeContent = [];
    let codeLang = '';
    let bulletItems = [];
    let orderedItems = [];
    let headingIndex = 0;
    const elements = [];

    const flushLists = () => {
      if (bulletItems.length) {
        elements.push(
          <ul key={`unordered-${elements.length}`} className="content-list">
            {bulletItems.map((item) => <li key={item.key}>{renderInline(item.text)}</li>)}
          </ul>
        );
        bulletItems = [];
      }

      if (orderedItems.length) {
        elements.push(
          <ol key={`ordered-${elements.length}`} className="content-list content-ordered-list">
            {orderedItems.map((item) => <li key={item.key}>{renderInline(item.text)}</li>)}
          </ol>
        );
        orderedItems = [];
      }
    };

    const flushCode = (key) => {
      elements.push(
        <div key={`code-${key}`} className="code-block">
          {codeLang && <span className="code-lang">{codeLang}</span>}
          <pre><code>{codeContent.join('\n')}</code></pre>
        </div>
      );
      codeContent = [];
      codeLang = '';
    };

    parts.forEach((part, i) => {
      if (part.startsWith('```') && !inCodeBlock) {
        flushLists();
        inCodeBlock = true;
        codeLang = part.replace('```', '').trim();
        codeContent = [];
        return;
      }
      if (part.startsWith('```') && inCodeBlock) {
        inCodeBlock = false;
        flushCode(i);
        return;
      }
      if (inCodeBlock) {
        codeContent.push(part);
        return;
      }
      if (part.startsWith('## ')) {
        flushLists();
        const heading = headings[headingIndex++];
        elements.push(<h2 key={i} id={heading?.id} className="content-h2">{renderInline(part.replace('## ', ''))}</h2>);
      } else if (part.startsWith('### ')) {
        flushLists();
        const heading = headings[headingIndex++];
        elements.push(<h3 key={i} id={heading?.id} className="content-h3">{renderInline(part.replace('### ', ''))}</h3>);
      } else if (part.startsWith('- ')) {
        if (orderedItems.length) flushLists();
        bulletItems.push({ key: i, text: part.replace('- ', '') });
      } else if (part.match(/^\d+\.\s/)) {
        if (bulletItems.length) flushLists();
        orderedItems.push({ key: i, text: part.replace(/^\d+\.\s/, '') });
      } else if (part.trim() === '') {
        flushLists();
      } else {
        flushLists();
        elements.push(<p key={i} className="content-p">{renderInline(part)}</p>);
      }
    });

    if (inCodeBlock) flushCode('final');
    flushLists();
    return elements;
  };

  return (
    <>
      <ReadingProgress />
      <motion.div
        className="post-detail-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="post-detail-container">
          <div className="post-detail-header">
            <button type="button" className="back-btn" onClick={() => navigate(-1)}>
              <FiArrowLeft aria-hidden="true" /> Back
            </button>
            <div className="post-actions">
              <ShareButton title={post.title} onStatus={showNotification} />
              <Link to={`/edit/${post.id}`} className="action-btn edit-btn">
                <FiEdit2 aria-hidden="true" /> Edit
              </Link>
              <button type="button" className="action-btn delete-btn" onClick={handleDelete}>
                <FiTrash2 aria-hidden="true" /> Delete
              </button>
            </div>
          </div>

          <div className="post-cover-wrapper">
            <img src={post.coverImage} alt={post.title} className="post-cover" />
            <div className="post-cover-gradient" />
            <div className="post-cover-overlay">
              <span className="post-category-badge">{post.category}</span>
            </div>
          </div>

          <div className="post-detail-content">
            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta-bar">
              <div className="post-author-info">
                <img src={post.authorAvatar} alt={post.author} className="post-author-avatar" />
                <div>
                  <span className="post-author-name">{post.author}</span>
                  <div className="post-meta-details">
                    <span><FiCalendar aria-hidden="true" /> {formatPostDate(post.date, { month: 'long' })}</span>
                    <span><FiClock aria-hidden="true" /> {post.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="post-interaction-btns">
                <motion.button
                  type="button"
                  className={`interact-btn ${post.isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  whileTap={{ scale: 1.2 }}
                  aria-label={post.isLiked ? 'Remove like' : 'Like this article'}
                  aria-pressed={Boolean(post.isLiked)}
                >
                  {post.isLiked ? <FaHeart aria-hidden="true" /> : <FiHeart aria-hidden="true" />}
                  <span>{post.likes}</span>
                </motion.button>
                <motion.button
                  type="button"
                  className={`interact-btn ${post.bookmarked ? 'bookmarked' : ''}`}
                  onClick={handleBookmark}
                  whileTap={{ scale: 1.2 }}
                  aria-label={post.bookmarked ? 'Remove from reading list' : 'Save to reading list'}
                  aria-pressed={Boolean(post.bookmarked)}
                >
                  {post.bookmarked ? <FaBookmark aria-hidden="true" /> : <FiBookmark aria-hidden="true" />}
                </motion.button>
              </div>
            </div>

            <div className="post-tags-bar">
              {(post.tags || []).map(tag => (
                <span key={tag} className="post-tag">#{tag}</span>
              ))}
            </div>

            <div className="article-layout">
              {headings.length > 0 && (
                <aside className="reading-guide" aria-label="On this page">
                  <p className="reading-guide-label">On this page</p>
                  <nav>
                    {headings.map((heading) => (
                      <a key={heading.id} className={heading.level === 3 ? 'reading-guide-subitem' : ''} href={`#${heading.id}`}>{heading.text}</a>
                    ))}
                  </nav>
                </aside>
              )}
              <article className="post-body">
                {renderContent(post.content)}
              </article>
            </div>

            <CommentSection postId={post.id} comments={post.comments || []} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PostDetail;
