import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BlogProvider, useBlog } from './context/BlogContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Bookmarks from './pages/Bookmarks';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { FiArrowUp, FiCheckCircle, FiEdit3, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import './App.css';

/* ===== Scroll To Top on Route Change ===== */
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const DocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageName = {
      '/': 'Discover ideas',
      '/create': 'Write a story',
      '/bookmarks': 'Your library',
    }[pathname] || (pathname.startsWith('/edit/') ? 'Edit story' : pathname.startsWith('/post/') ? 'Read story' : 'Page not found');

    document.title = `${pageName} | BlogVerse`;
  }, [pathname]);

  return null;
};

/* ===== Scroll To Top Button ===== */
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
        >
          <FiArrowUp aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ===== 404 Page ===== */
const NotFound = () => (
  <motion.div
    className="not-found-page"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="not-found-code">404</div>
    <h2 className="not-found-title">Page Not Found</h2>
    <p className="not-found-desc">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="not-found-link">← Back to Home</Link>
  </motion.div>
);

/* ===== Animated Routes ===== */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="page-transition"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

/* ===== Footer ===== */
const Footer = () => {
  const { setSelectedCategory, setSearchQuery, showNotification } = useBlog();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleCategory = (category) => {
    setSearchQuery('');
    setSelectedCategory(category);
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    setIsSubscribed(true);
    setEmail('');
    showNotification('You are on the list. Thanks for subscribing!');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo"><FiEdit3 aria-hidden="true" /> <span>BlogVerse</span></div>
          <p className="footer-desc">A focused space for practical ideas, thoughtful stories, and better building.</p>
          <div className="footer-social">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="BlogVerse on GitHub"><FiGithub aria-hidden="true" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="BlogVerse on Twitter"><FiTwitter aria-hidden="true" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="BlogVerse on LinkedIn"><FiLinkedin aria-hidden="true" /></a>
            <a href="mailto:contact@blogverse.com" aria-label="Email BlogVerse"><FiMail aria-hidden="true" /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Discover stories</Link></li>
            <li><Link to="/create">Write a story</Link></li>
            <li><Link to="/bookmarks">Your reading list</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Topics</h4>
          <ul>
            {['Technology', 'Design', 'Backend', 'DevOps'].map((category) => (
              <li key={category}><Link to="/" onClick={() => handleCategory(category)}>{category}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-section footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>One thoughtful read at a time. No noise, just useful ideas.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            <button type="submit">{isSubscribed ? <FiCheckCircle aria-label="Subscribed" /> : 'Subscribe'}</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BlogVerse. Built with care by Yash Wankhede.</p>
        <div className="footer-bottom-links"><Link to="/">Discover</Link><Link to="/create">Write</Link></div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BlogProvider>
          <Router>
            <div className="app">
              <a className="skip-link" href="#main-content">Skip to content</a>
              <Navbar />
              <Notification />
              <ScrollToTopOnNavigate />
              <DocumentTitle />
              <main id="main-content" className="main-content" tabIndex="-1">
                <AnimatedRoutes />
              </main>
              <Footer />
              <ScrollToTopButton />
            </div>
          </Router>
        </BlogProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
