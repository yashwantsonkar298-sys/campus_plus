import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminTabs = () => (
  <nav className="admin-tabs" aria-label="Admin pages">
    <NavLink end to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
      Events
    </NavLink>
    <NavLink to="/admin/people" className={({ isActive }) => isActive ? 'active' : ''}>
      People Registered
    </NavLink>
  </nav>
);

export default AdminTabs;
