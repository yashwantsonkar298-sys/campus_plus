import React, { useEffect, useMemo, useState } from 'react';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiUsers, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import './Home.css';

const HERO_WORDS = ['Ideas', 'Stories', 'Knowledge', 'Insights'];
const PARTICLES = [
  { left: '10%', top: '25%', size: 10, x: 6, duration: 4.2, delay: 0 },
  { left: '24%', top: '70%', size: 16, x: -10, duration: 5.4, delay: 0.4 },
  { left: '40%', top: '16%', size: 8, x: 9, duration: 4.8, delay: 0.8 },
  { left: '58%', top: '66%', size: 12, x: -7, duration: 5.7, delay: 1.2 },
  { left: '76%', top: '22%', size: 14, x: 8, duration: 4.5, delay: 1.6 },
  { left: '88%', top: '64%', size: 9, x: -5, duration: 5.1, delay: 2 },
];

/* ===== Typewriter Hook ===== */
const useTypewriter = (words, speed = 100, pause = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const isComplete = text === current;
    const isEmpty = text.length === 0;
    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (isEmpty) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        } else {
          setText(current.substring(0, text.length - 1));
        }
      } else if (isComplete) {
        setIsDeleting(true);
      } else {
        setText(current.substring(0, text.length + 1));
      }
    }, isDeleting ? speed / 2 : isComplete ? pause : speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
};

/* ===== Floating Particles ===== */
const FloatingParticles = () => (
  <div className="particles-container">
    {PARTICLES.map((particle, i) => (
      <motion.div
        key={i}
        className="particle"
        animate={{
          y: [0, -30, 0],
          x: [0, particle.x, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: particle.duration,
          repeat: Infinity,
          delay: particle.delay,
          ease: "easeInOut",
        }}
        style={{
          left: particle.left,
          top: particle.top,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
        }}
      />
    ))}
  </div>
);

/* ===== Stats Bar ===== */
const StatsBar = ({ posts }) => {
  const uniqueAuthors = [...new Set(posts.map(p => p.author))].length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

  const stats = [
    { icon: <FiFileText />, value: posts.length, label: 'Articles' },
    { icon: <FiUsers />, value: uniqueAuthors, label: 'Authors' },
    { icon: <FiTrendingUp />, value: totalLikes, label: 'Likes' },
    { icon: <FiBookOpen />, value: totalComments, label: 'Comments' },
  ];

  return (
    <motion.div
      className="stats-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="stat-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.1 }}
          whileHover={{ scale: 1.05, y: -3 }}
        >
          <span className="stat-icon">{stat.icon}</span>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ===== Featured Post ===== */
const FeaturedPost = ({ post }) => {
  if (!post) return null;

  return (
    <motion.div
      className="featured-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 className="section-title">
        <span className="section-badge">🔥</span> Trending Post
      </h2>
      <Link to={`/post/${post.id}`} className="featured-card">
        <div className="featured-image">
          <img src={post.coverImage} alt={post.title} />
          <div className="featured-overlay">
            <span className="featured-badge">{post.category}</span>
          </div>
        </div>
        <div className="featured-content">
          <div className="featured-meta">
            <img src={post.authorAvatar} alt={post.author} className="featured-avatar" />
            <span className="featured-author">{post.author}</span>
            <span className="featured-dot">•</span>
            <span className="featured-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span className="featured-dot">•</span>
            <span className="featured-read">{post.readTime}</span>
          </div>
          <h3 className="featured-title">{post.title}</h3>
          <p className="featured-excerpt">{post.excerpt}</p>
          <div className="featured-tags">
            {post.tags.map(tag => (
              <span key={tag} className="featured-tag">#{tag}</span>
            ))}
          </div>
          <div className="featured-stats">
            <span>❤️ {post.likes} likes</span>
            <span>💬 {post.comments?.length || 0} comments</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ===== Home Page ===== */
const Home = () => {
  const { filteredPosts, posts, searchQuery, selectedCategory } = useBlog();
  const typedText = useTypewriter(HERO_WORDS, 120, 1500);

  const featuredPost = useMemo(() => [...posts].sort((a, b) => b.likes - a.likes)[0], [posts]);
  const isFiltering = searchQuery || selectedCategory !== 'All';

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-wrapper">
        <FloatingParticles />
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✨ Welcome to BlogVerse
          </motion.span>
          <h1 className="hero-title">
            Discover Amazing <br />
            <span className="highlight">{typedText}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="hero-subtitle">
            Explore curated articles on technology, design, and development from passionate writers around the world.
          </p>
          <div className="hero-signals" aria-label="BlogVerse highlights">
            <span><strong>{posts.length}+</strong> practical reads</span>
            <span><strong>4</strong> expert topics</span>
            <span><strong>Local-first</strong> writing space</span>
          </div>
          <div className="hero-cta">
            <Link to="/create" className="cta-primary">
              ✍️ Start Writing
            </Link>
            <a href="#explore" className="cta-secondary">
              Explore Articles ↓
            </a>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <StatsBar posts={posts} />

      {/* Featured Post */}
      {!isFiltering && <FeaturedPost post={featuredPost} />}

      {/* Search & Filter */}
      <div id="explore">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="section-badge">📚</span> All Articles
        </motion.h2>
        <SearchBar />
      </div>

      {filteredPosts.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No posts found"
          message={
            searchQuery
              ? `No results for "${searchQuery}"${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}. Try a different search term.`
              : `No posts in the "${selectedCategory}" category yet.`
          }
          action={
            <Link to="/create" className="empty-action-btn">
              Create the first post
            </Link>
          }
        />
      ) : (
        <>
          <motion.p
            className="results-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          </motion.p>
          <div className="blog-grid">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
