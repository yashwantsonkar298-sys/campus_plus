import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>About Campus+</h4>
          <p>
            Your ultimate platform to discover, manage, and participate in college club events.
            Empowering students to connect, learn, and grow together.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="GitHub"><FiGithub /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/admin">Admin Dashboard</Link>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <p><FiMail style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> contact@campusplus.edu</p>
          <p><FiPhone style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> +91 98765 43210</p>
          <p><FiMapPin style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> University Campus, College Town</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Campus+ Club Events. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
