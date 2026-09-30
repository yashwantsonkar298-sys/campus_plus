import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { FiSearch, FiCalendar, FiMapPin, FiClock, FiFrown, FiArrowRight } from 'react-icons/fi';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon'];

const EventsPage = () => {
  const { events } = useEventContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="events-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>All Events</h1>
          <p>{filteredEvents.length} events found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search events by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div className="card" key={event.id}>
              <div className="card-img-wrapper">
                <img
                  src={event.image}
                  alt={event.name}
                  className="card-img"
                />
                {event.featured && (
                  <span className="badge badge-featured">Featured</span>
                )}
              </div>
              <div className="card-body">
                <span className={`badge badge-${event.category}`}>{event.category}</span>
                <h3 className="card-title">{event.name}</h3>
                <div className="card-meta">
                  <span><FiCalendar /> {event.date}</span>
                  <span><FiClock /> {event.time}</span>
                </div>
                <div className="card-meta">
                  <span><FiMapPin /> {event.venue}</span>
                </div>
                <p className="card-desc">{event.description}</p>
                <div className="card-footer">
                  <Link to={`/events/${event.id}`} className="btn btn-primary">
                    View Details <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <FiFrown className="no-results-icon" />
          <h2>No events found</h2>
          <p>Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
