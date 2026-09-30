import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ placeholder = "Search events...", value, onChange }) => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
