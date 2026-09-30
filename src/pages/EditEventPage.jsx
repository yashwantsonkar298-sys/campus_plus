import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon'];

const EditEventPage = () => {
  const { id } = useParams();
  const { events, editEvent } = useEventContext();
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

  const [error, setError] = useState(null);

  useEffect(() => {
    const eventToEdit = events.find(e => e.id === id || e.id.toString() === id);
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name || '',
        category: eventToEdit.category || '',
        date: eventToEdit.date || '',
        time: eventToEdit.time || '',
        venue: eventToEdit.venue || '',
        description: eventToEdit.description || '',
        image: eventToEdit.image || '',
        featured: eventToEdit.featured || false
      });
    } else {
      setError('Event not found');
    }
  }, [id, events]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editEvent(id, formData);
    toast.success('Event updated successfully!');
    navigate('/admin');
  };

  if (error) {
    return (
      <div className="form-page">
        <div className="error-state">
          <p>{error}</p>
          <Link to="/admin" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <Link to="/admin" className="back-link">
        <FiArrowLeft /> Back to Dashboard
      </Link>

      <h1>Edit Event</h1>

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
              <FiSave /> Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
