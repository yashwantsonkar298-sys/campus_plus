import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import initialBlogData from '../data/blogData';
import { v4 as uuidv4 } from 'uuid';
import { getReadingTime } from '../utils/postUtils';

const BlogContext = createContext();
const POSTS_STORAGE_KEY = 'blog-posts';

const getInitialPosts = () => {
  try {
    const saved = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!saved) return initialBlogData;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialBlogData;
  } catch {
    return initialBlogData;
  }
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState(getInitialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [notification, setNotification] = useState(null);
  const notificationTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // The interface remains usable if browser storage is unavailable.
    }
  }, [posts]);

  useEffect(() => () => clearTimeout(notificationTimer.current), []);

  const showNotification = useCallback((message, type = 'success') => {
    clearTimeout(notificationTimer.current);
    setNotification({ message, type });
    notificationTimer.current = setTimeout(() => setNotification(null), 3200);
  }, []);

  const addPost = (post) => {
    const author = post.author.trim();
    const content = post.content.trim();
    const newPost = {
      ...post,
      title: post.title.trim(),
      excerpt: post.excerpt.trim(),
      content,
      author,
      tags: Array.isArray(post.tags) ? post.tags : [],
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      readTime: getReadingTime(content),
      likes: 0,
      isLiked: false,
      bookmarked: false,
      comments: [],
      authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author.toLowerCase().replace(/\s/g, ''))}`,
    };
    setPosts(prev => [newPost, ...prev]);
    showNotification('Your story is live. Nice work!');
    return newPost.id;
  };

  const updatePost = (id, updatedData) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== id) return post;

      const content = (updatedData.content ?? post.content).trim();
      const author = (updatedData.author ?? post.author).trim();

      return {
        ...post,
        ...updatedData,
        title: (updatedData.title ?? post.title).trim(),
        excerpt: (updatedData.excerpt ?? post.excerpt).trim(),
        content,
        author,
        tags: Array.isArray(updatedData.tags) ? updatedData.tags : post.tags,
        readTime: getReadingTime(content),
        authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author.toLowerCase().replace(/\s/g, ''))}`,
      };
    }));
    showNotification('Your changes have been saved.');
  };

  const deletePost = (id) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    showNotification('Post deleted successfully!', 'info');
  };

  const toggleLike = (id) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        const isLiked = post.isLiked;
        return { ...post, likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1, isLiked: !isLiked };
      }
      return post;
    }));
  };

  const toggleBookmark = (id) => {
    setPosts(prev => prev.map(post =>
      post.id === id ? { ...post, bookmarked: !post.bookmarked } : post
    ));
  };

  const addComment = (postId, comment) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), {
            id: uuidv4(),
            ...comment,
            date: new Date().toISOString().split('T')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.author.toLowerCase().replace(/\s/g, ''))}`
          }]
        };
      }
      return post;
    }));
    showNotification('Comment added!');
  };

  const deleteComment = (postId, commentId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: (post.comments || []).filter(c => c.id !== commentId) };
      }
      return post;
    }));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('latest');
  };

  const filteredPosts = [...posts].filter(post => {
    const query = searchQuery.trim().toLowerCase();
    const tags = Array.isArray(post.tags) ? post.tags : [];
    const matchesSearch = !query || post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      tags.some(tag => tag.toLowerCase().includes(query)) ||
      post.author.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
    if (sortBy === 'discussed') return (b.comments?.length || 0) - (a.comments?.length || 0);
    if (sortBy === 'quick') return parseInt(a.readTime, 10) - parseInt(b.readTime, 10);
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <BlogContext.Provider value={{
      posts,
      filteredPosts,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      sortBy,
      setSortBy,
      resetFilters,
      addPost,
      updatePost,
      deletePost,
      toggleLike,
      toggleBookmark,
      addComment,
      deleteComment,
      notification,
      showNotification,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
