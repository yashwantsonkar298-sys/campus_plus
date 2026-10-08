import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiPlusCircle, FiBookmark, FiEdit3 } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useBlog } from '../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { posts } = useBlog();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const bookmarkCount = posts.filter((post) => post.bookmarked).length;

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><FiEdit3 aria-hidden="true" /></span>
          <span className="logo-text">BlogVerse</span>
        </Link>

        <div id="primary-navigation" className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`} aria-label="Primary navigation">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/bookmarks"
            className={`nav-link ${isActive('/bookmarks') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiBookmark aria-hidden="true" /> Bookmarks
            {bookmarkCount > 0 && <span className="bookmark-count" aria-label={`${bookmarkCount} bookmarked articles`}>{bookmarkCount}</span>}
          </Link>
          <Link
            to="/create"
            className={`nav-link create-btn ${isActive('/create') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiPlusCircle aria-hidden="true" /> Write
          </Link>
        </div>

        <div className="navbar-actions">
          <motion.button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
            aria-pressed={isDarkMode}
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FiSun aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FiMoon aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
          >
            {isMobileMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
