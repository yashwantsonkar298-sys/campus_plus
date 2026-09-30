import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiAward, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' ? 'active' : '';
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <FiAward /> Campus+
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={closeMenu}>
            Home
          </Link>
          <Link to="/events" className={isActive('/events')} onClick={closeMenu}>
            Events
          </Link>
          <Link to="/admin" className={isActive('/admin')} onClick={closeMenu}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
