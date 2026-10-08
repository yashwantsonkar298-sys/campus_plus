import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/BlogCard';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import './Home.css';

const Bookmarks = () => {
  const { posts } = useBlog();
  const bookmarkedPosts = posts.filter(post => post.bookmarked);

  return (
    <div className="home-page">
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="hero-title">
          Your <span className="highlight">Bookmarks</span>
        </h1>
        <p className="hero-subtitle">
          Your saved articles, all in one place.
        </p>
      </motion.div>

      {bookmarkedPosts.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="No bookmarks yet"
          message="Start bookmarking articles you love and they'll appear here."
          action={
            <Link to="/" className="empty-action-btn">
              Explore Articles
            </Link>
          }
        />
      ) : (
        <>
          <p className="results-count">
            {bookmarkedPosts.length} saved {bookmarkedPosts.length === 1 ? 'article' : 'articles'}
          </p>
          <div className="blog-grid">
            {bookmarkedPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmarks;

