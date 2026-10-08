import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiBookmark, FiClock, FiMessageCircle } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import { useBlog } from '../context/BlogContext';
import { motion } from 'framer-motion';
import { formatPostDate } from '../utils/postUtils';
import './BlogCard.css';

const BlogCard = ({ post, index }) => {
  const { toggleLike, toggleBookmark, showNotification } = useBlog();

  const handleLike = (event) => {
    event.preventDefault();
    toggleLike(post.id);
    showNotification(post.isLiked ? 'Like removed.' : 'Thanks for showing this story some love.');
  };

  const handleBookmark = (event) => {
    event.preventDefault();
    toggleBookmark(post.id);
    showNotification(post.bookmarked ? 'Removed from your reading list.' : 'Saved to your reading list.');
  };

  return (
    <motion.article
      className="blog-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -5 }}
      layout
    >
      <Link to={`/post/${post.id}`} className="card-image-link">
        <div className="card-image-wrapper">
          <img src={post.coverImage} alt={post.title} className="card-image" loading="lazy" />
          <div className="card-category-badge">{post.category}</div>
        </div>
      </Link>
      <div className="card-content">
        <div className="card-meta">
          <div className="card-author">
            <img src={post.authorAvatar} alt={post.author} className="author-avatar" />
            <span className="author-name">{post.author}</span>
          </div>
          <span className="card-date">{formatPostDate(post.date)}</span>
        </div>
        <Link to={`/post/${post.id}`} className="card-title-link">
          <h2 className="card-title">{post.title}</h2>
        </Link>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-tags">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
        <div className="card-footer">
          <div className="card-stats">
            <motion.button
              type="button"
              className={`stat-btn like-btn ${post.isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              whileTap={{ scale: 1.3 }}
              aria-label={post.isLiked ? `Remove like from ${post.title}` : `Like ${post.title}`}
              aria-pressed={Boolean(post.isLiked)}
            >
              {post.isLiked ? <FaHeart aria-hidden="true" /> : <FiHeart aria-hidden="true" />}
              <span>{post.likes}</span>
            </motion.button>
            <motion.button
              type="button"
              className={`stat-btn bookmark-btn ${post.bookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
              whileTap={{ scale: 1.3 }}
              aria-label={post.bookmarked ? `Remove ${post.title} from reading list` : `Save ${post.title} to reading list`}
              aria-pressed={Boolean(post.bookmarked)}
            >
              {post.bookmarked ? <FaBookmark aria-hidden="true" /> : <FiBookmark aria-hidden="true" />}
            </motion.button>
            <span className="stat-item">
              <FiMessageCircle aria-hidden="true" /> {post.comments?.length || 0}
            </span>
          </div>
          <span className="read-time">
            <FiClock aria-hidden="true" /> {post.readTime}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
