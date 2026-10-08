import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiInfo } from 'react-icons/fi';
import { useBlog } from '../context/BlogContext';
import './Notification.css';

const Notification = () => {
  const { notification } = useBlog();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className={`notification ${notification.type}`}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <span className="notification-icon">
            {notification.type === 'success' ? <FiCheck /> : <FiInfo />}
          </span>
          <span className="notification-text">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
