import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon'];

const AddEventPage = () => {
  const { addEvent } = useEventContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    image: '',
    featured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(formData);
    toast.success('Event added successfully!');
    navigate('/admin');
  };

  return (
    <div className="form-page">
      <Link to="/admin" className="back-link">
        <FiArrowLeft /> Back to Dashboard
      </Link>

      <h1>Add New Event</h1>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Tech Symposium 2024"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="form-control"
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time *</label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Venue *</label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Main Auditorium"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-control"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Detailed description of the event..."
              ></textarea>
            </div>

            <div className="checkbox-group full-width">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">Mark as Featured Event</label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FiSave /> Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
