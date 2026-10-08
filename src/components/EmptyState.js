import React from 'react';
import { motion } from 'framer-motion';
import './EmptyState.css';

const EmptyState = ({ icon, title, message, action }) => {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <span className="empty-icon">{icon}</span>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
