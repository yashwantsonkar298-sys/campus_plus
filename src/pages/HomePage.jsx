import React from 'react';
import { Link } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { FiCalendar, FiUsers, FiStar, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const { events } = useEventContext();

  const totalEvents = events.length;
  const categories = [...new Set(events.map(e => e.category))];
  const totalRegistrations = events.reduce(
    (sum, e) => sum + (e.registrations?.length || 0), 0
  );

  const featuredEvents = events.filter(e => e.featured).slice(0, 3);
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Campus Plus</h1>
          <p>Your Gateway to Campus Events — Discover, Register, and Participate in the Best College Events</p>
          <div className="cta-buttons">
            <Link to="/events" className="btn btn-primary btn-lg">
              <FiCalendar /> Explore Events
            </Link>
            <Link to="/admin" className="btn btn-secondary btn-lg">
              Admin Dashboard <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <FiCalendar className="stat-icon" />
          <h3>{totalEvents}</h3>
          <p>Total Events</p>
        </div>
        <div className="stat-card">
          <FiStar className="stat-icon" />
          <h3>{categories.length}</h3>
          <p>Categories</p>
        </div>
        <div className="stat-card">
          <FiUsers className="stat-icon" />
          <h3>{totalRegistrations}</h3>
          <p>Registrations</p>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>⭐ Featured Events</h2>
          </div>
          <div className="events-grid">
            {featuredEvents.map(event => (
              <div className="card" key={event.id}>
                <div className="card-img-wrapper">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="card-img"
                  />
                  <span className={`badge badge-${event.category} badge-featured`}>
                    Featured
                  </span>
                </div>
                <div className="card-body">
                  <span className={`badge badge-${event.category}`}>{event.category}</span>
                  <h3 className="card-title">{event.name}</h3>
                  <div className="card-meta">
                    <span><FiCalendar /> {event.date}</span>
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
        </section>
      )}

      {/* Upcoming Events */}
      <section className="upcoming-section">
        <div className="section-header">
          <h2>📅 Upcoming Events</h2>
        </div>
        <div className="events-grid">
          {upcomingEvents.map(event => (
            <div className="card" key={event.id}>
              <div className="card-img-wrapper">
                <img
                  src={event.image}
                  alt={event.name}
                  className="card-img"
                />
              </div>
              <div className="card-body">
                <span className={`badge badge-${event.category}`}>{event.category}</span>
                <h3 className="card-title">{event.name}</h3>
                <div className="card-meta">
                  <span><FiCalendar /> {event.date}</span>
                  <span><FiClock /> {event.time}</span>
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
        <div className="section-header" style={{ marginTop: '2rem' }}>
          <Link to="/events" className="btn btn-outline btn-lg">
            View All Events <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2>About Campus Plus</h2>
        <p>
          Campus Plus is your one-stop platform for discovering and participating in all college club activities.
          Whether you're looking for technical workshops, cultural fests, hackathons, or sports tournaments — we've got you covered.
          Join us in making campus life vibrant and engaging!
        </p>
      </section>
    </div>
  );
};

export default HomePage;
