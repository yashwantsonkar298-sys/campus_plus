import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch, FiCalendar, FiTag, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { events, deleteEvent, getEventRegistrations } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteEvent(id);
      toast.success('Event deleted successfully');
    }
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEvents = events.length;
  const totalRegistrations = events.reduce(
    (sum, event) => sum + (event.registrations?.length || 0), 0
  );
  const categoriesCount = new Set(events.map(e => e.category)).size;
  const featuredCount = events.filter(e => e.featured).length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Admin Dashboard</h1>
          <p>Manage your events and registrations</p>
        </div>
        <Link to="/admin/add" className="btn btn-primary">
          <FiPlus /> Add New Event
        </Link>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue"><FiCalendar /></div>
          <div className="admin-stat-info">
            <p>Total Events</p>
            <h3>{totalEvents}</h3>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon green"><FiUsers /></div>
          <div className="admin-stat-info">
            <p>Total Registrations</p>
            <h3>{totalRegistrations}</h3>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon purple"><FiTag /></div>
          <div className="admin-stat-info">
            <p>Categories</p>
            <h3>{categoriesCount}</h3>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon amber"><FiStar /></div>
          <div className="admin-stat-info">
            <p>Featured Events</p>
            <h3>{featuredCount}</h3>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Events</h2>
          <div className="table-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <table className="table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Registrations</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <tr key={event.id}>
                  <td>
                    <strong>{event.name}</strong>
                    {event.featured && <FiStar style={{ color: '#f59e0b', marginLeft: '0.5rem' }} />}
                  </td>
                  <td>
                    <span className={`badge badge-${event.category}`}>{event.category}</span>
                  </td>
                  <td>{event.date}</td>
                  <td>{event.registrations?.length || 0}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-icon view"
                        title="View Registrations"
                        onClick={() => navigate(`/admin/registrations/${event.id}`)}
                      >
                        <FiUsers />
                      </button>
                      <button
                        className="btn-icon edit"
                        title="Edit Event"
                        onClick={() => navigate(`/admin/edit/${event.id}`)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Delete Event"
                        onClick={() => handleDelete(event.id, event.name)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No events found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="mobile-cards">
          {filteredEvents.map(event => (
            <div className="mobile-event-card" key={event.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{event.name}</h3>
                <span className={`badge badge-${event.category}`}>{event.category}</span>
              </div>
              <div className="card-meta">
                <span><FiCalendar /> {event.date}</span>
                <span><FiUsers /> {event.registrations?.length || 0} registrations</span>
              </div>
              <div className="mobile-event-actions">
                <button className="btn-icon view" onClick={() => navigate(`/admin/registrations/${event.id}`)}>
                  <FiUsers />
                </button>
                <button className="btn-icon edit" onClick={() => navigate(`/admin/edit/${event.id}`)}>
                  <FiEdit2 />
                </button>
                <button className="btn-icon delete" onClick={() => handleDelete(event.id, event.name)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
