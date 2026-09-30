import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

const categoryColors = {
  Technical: '#6366f1',
  Cultural: '#ec4899',
  Sports: '#22c55e',
  Workshop: '#f59e0b',
  Seminar: '#06b6d4',
  Hackathon: '#ef4444'
};

const EventCard = ({ event }) => {
  const { id, title, image, category, date, time, venue, description } = event;
  
  // Determine badge color or fallback to a default grey
  const badgeColor = categoryColors[category] || '#6b7280';
  
  // Truncate description to 100 characters
  const truncatedDesc = description?.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;

  return (
    <div className="event-card">
      <div className="event-image-container">
        <img src={image || 'https://via.placeholder.com/400x200?text=Event+Image'} alt={title} className="event-image" />
        <span className="event-badge" style={{ backgroundColor: badgeColor }}>
          {category}
        </span>
      </div>
      
      <div className="event-content">
        <h3 className="event-title">{title}</h3>
        
        <div className="event-details">
          <span className="event-detail-item">
            <FiCalendar /> {date}
          </span>
          <span className="event-detail-item">
            <FiClock /> {time}
          </span>
          <span className="event-detail-item">
            <FiMapPin /> {venue}
          </span>
        </div>
        
        <p className="event-description">{truncatedDesc}</p>
        
        <Link to={`/events/${id}`} className="btn-view-details">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
