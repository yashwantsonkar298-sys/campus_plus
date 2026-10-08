import React from 'react';
import { FiRotateCcw, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { useBlog } from '../context/BlogContext';
import { categories } from '../data/blogData';
import { motion } from 'framer-motion';
import './SearchBar.css';

const SearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    resetFilters,
  } = useBlog();
  const isFiltering = searchQuery || selectedCategory !== 'All' || sortBy !== 'latest';

  return (
    <motion.div
      className="search-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="search-toolbar">
        <div>
          <p className="search-eyebrow">Explore the collection</p>
          <h3 className="search-heading">Find your next useful read</h3>
        </div>
        <label className="sort-control">
          <FiSliders aria-hidden="true" />
          <span className="sr-only">Sort articles</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="latest">Newest first</option>
            <option value="popular">Most liked</option>
            <option value="discussed">Most discussed</option>
            <option value="quick">Quick reads</option>
          </select>
        </label>
      </div>
      <div className="search-bar">
        <FiSearch className="search-icon" aria-hidden="true" />
        <label className="sr-only" htmlFor="article-search">Search articles</label>
        <input
          id="article-search"
          type="text"
          placeholder="Search articles, tags, authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button type="button" className="clear-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="filter-row">
        <div className="category-filters" aria-label="Filter by category">
          {categories.map(category => (
            <motion.button
              type="button"
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </motion.button>
          ))}
        </div>
        {isFiltering && (
          <button type="button" className="reset-filters-btn" onClick={resetFilters}>
            <FiRotateCcw aria-hidden="true" /> Reset
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
