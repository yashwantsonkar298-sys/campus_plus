import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { normalizeRegistration, registrationError, notificationLabels } from '../lib/registration';

const EventDetailPage = () => {
  const { id } = useParams();
  const { events, registerForEvent } = useEventContext();

  const event = events.find(e => e.id === id || e.id.toString() === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: '1st Year',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const submitting = useRef(false);
  const request = useRef(null);

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  const registrations = event.registrations || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current) return;
    const details = normalizeRegistration(formData);
    const error = registrationError(details);
    if (error) { toast.error(error); return; }
    const signature = JSON.stringify({ eventId: event.id, ...details });
    if (request.current?.signature !== signature) {
      request.current = { signature, id: crypto.randomUUID() };
    }
    submitting.current = true;
    setIsSubmitting(true);
    setConfirmation(null);
    try {
      const result = await registerForEvent(event.id, details, request.current.id);
      setConfirmation({ ...result, eventId: event.id });
      const incomplete = ['email', 'sms'].filter(channel => result.registration.notifications[channel]?.status !== 'accepted');
      if (incomplete.length) {
        const channels = incomplete.map(channel => channel === 'email' ? 'Email' : 'SMS').join(' and ');
        toast(`Registration saved. ${channels} confirmation needs attention. See the status below.`, { icon: '!', duration: 7000 });
      } else {
        toast.success('Registration saved. Email and SMS accepted for delivery.');
      }
      setFormData({ name: '', email: '', college: '', year: '1st Year', phone: '' });
      request.current = null;
    } catch (error) {
      toast.error(error.message, { duration: 6000 });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-detail-page">
      <Link to="/events" className="back-link">
        <FiArrowLeft /> Back to Events
      </Link>

      <div className="event-detail-content">
        {/* Event Info */}
        <div className="event-info">
          <img
            src={event.image}
            alt={event.name}
            className="event-hero-image"
          />
          <div className="event-header">
            <span className={`badge badge-${event.category}`}>{event.category}</span>
            <h1>{event.name}</h1>
          </div>

          <div className="event-meta">
            <p><FiCalendar /> {event.date}</p>
            <p><FiClock /> {event.time}</p>
            <p><FiMapPin /> {event.venue}</p>
            <p><FiUsers /> {registrations.length} Registered</p>
          </div>

          <div className="event-description">
            <h3>About this Event</h3>
            <p>{event.description}</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="registration-section">
          <h3>📝 Register for this Event</h3>
          <p className="registration-note">Get your registration confirmation by email and SMS at the details below.</p>
          {confirmation?.eventId === event.id && (
            <div className="registration-confirmation" role="status" aria-live="polite">
              <strong>Registration confirmed</strong>
              <p className="registration-reference">Reference: {confirmation.registration.id}</p>
              {['email', 'sms'].map(channel => (
                <p key={channel} className="notification-status">
                  <strong>{channel === 'email' ? 'Email' : 'SMS'}:</strong>{' '}
                  {notificationLabels[confirmation.registration.notifications[channel]?.status] || notificationLabels.unknown}
                  <span>{channel === 'email' ? confirmation.registration.email : confirmation.registration.phone}</span>
                </p>
              ))}
              <p>Your place is registered even if a confirmation message is unavailable.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="registration-form" aria-busy={isSubmitting}>
            <fieldset disabled={isSubmitting} className="registration-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="registration-name">Full Name</label>
              <input
                id="registration-name"
                autoComplete="name"
                maxLength={100}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="registration-email">Email</label>
              <input
                id="registration-email"
                autoComplete="email"
                maxLength={254}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="registration-college">College Name</label>
              <input
                id="registration-college"
                maxLength={160}
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your college name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="registration-year">Year of Study</label>
              <select
                id="registration-year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-control"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="registration-phone">Phone Number</label>
              <input
                id="registration-phone"
                autoComplete="tel"
                maxLength={24}
                aria-describedby="registration-phone-hint"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="9876543210 or +91 9876543210"
                required
              />
              <small id="registration-phone-hint" className="registration-note">10-digit Indian numbers use +91. For other countries, include the country code.</small>
            </div>
            <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Registering & sending confirmations…' : 'Register Now'}
            </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
