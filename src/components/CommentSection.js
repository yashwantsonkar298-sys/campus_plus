import React, { useState } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { useBlog } from '../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPostDate } from '../utils/postUtils';
import './CommentSection.css';

const CommentSection = ({ postId, comments = [] }) => {
  const { addComment, deleteComment, showNotification } = useBlog();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    addComment(postId, { author: author.trim(), text: text.trim() });
    setAuthor('');
    setText('');
  };

  const handleDelete = (commentId) => {
    deleteComment(postId, commentId);
    showNotification('Comment removed.', 'info');
  };

  return (
    <div className="comment-section">
      <h3 className="comments-title">
        Comments ({comments.length})
      </h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="comment-author">Your name</label>
        <input
          id="comment-author"
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="comment-input"
          required
        />
        <div className="comment-textarea-wrapper">
          <label className="sr-only" htmlFor="comment-text">Your comment</label>
          <textarea
            id="comment-text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="comment-textarea"
            rows="3"
            required
          />
          <motion.button
            type="submit"
            className="comment-submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!author.trim() || !text.trim()}
          >
            <FiSend aria-hidden="true" /> Post
          </motion.button>
        </div>
      </form>

      <div className="comments-list">
        <AnimatePresence>
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map(comment => (
              <motion.div
                key={comment.id}
                className="comment-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="comment-header">
                  <div className="comment-author-info">
                    <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                    <div>
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">{formatPostDate(comment.date)}</span>
                    </div>
                  </div>
                  <button type="button" className="comment-delete" onClick={() => handleDelete(comment.id)} aria-label={`Delete comment from ${comment.author}`}>
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>
                <p className="comment-text">{comment.text}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentSection;
