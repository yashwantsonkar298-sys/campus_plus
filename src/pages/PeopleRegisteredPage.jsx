import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw, FiSearch, FiUsers } from 'react-icons/fi';
import AdminTabs from '../components/AdminTabs';
import { useEventContext } from '../context/EventContext';

const formatRegisteredAt = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString();
};

const localPeople = (events) => events.flatMap(event =>
  (event.registrations || []).map(registration => ({
    id: registration.id || `${event.id}-${registration.email || registration.name}`,
    name: registration.name,
    college: registration.college,
    year: registration.year,
    registeredAt: registration.registeredAt,
    event: {
      id: String(event.id),
      name: event.name,
      date: event.date,
      time: event.time,
      venue: event.venue,
    },
  }))
);

const PeopleRegisteredPage = () => {
  const { events } = useEventContext();
  const fallbackRegistrations = useMemo(() => localPeople(events), [events]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  const loadRegistrations = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/registrations', {
        headers: { 'X-Requested-With': 'CampusPlus' },
        signal: AbortSignal.timeout(10000),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !Array.isArray(result.registrations)) {
        throw new Error(result.error || 'Could not load registrations.');
      }
      setRegistrations(result.registrations);
      setLoadError('');
    } catch {
      setRegistrations(fallbackRegistrations);
      setLoadError('The saved server list could not be loaded. Showing registrations saved in this browser.');
    } finally {
      setIsLoading(false);
    }
  }, [fallbackRegistrations]);

  useEffect(() => {
    const loadOnMount = async () => {
      await loadRegistrations();
    };
    void loadOnMount();
  }, [loadRegistrations]);

  const refreshRegistrations = async () => {
    setIsRefreshing(true);
    await loadRegistrations();
    setIsRefreshing(false);
  };

  const eventsWithRegistrations = useMemo(() => {
    const eventMap = new Map();
    registrations.forEach(registration => {
      if (registration.event?.id && registration.event?.name) {
        eventMap.set(registration.event.id, registration.event);
      }
    });
    return [...eventMap.values()].sort((first, second) => first.name.localeCompare(second.name));
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return registrations.filter(registration => {
      const matchesEvent = !eventFilter || registration.event?.id === eventFilter;
      if (!matchesEvent) return false;
      if (!query) return true;
      return [registration.name, registration.event?.name, registration.college, registration.year]
        .some(value => String(value || '').toLowerCase().includes(query));
    });
  }, [eventFilter, registrations, searchTerm]);

  const emptyMessage = registrations.length === 0
    ? 'No one has registered for an event yet.'
    : 'No registrations match your search.';

  return (
    <div className="registrations-page people-registered-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/admin" className="back-link" aria-label="Back to admin dashboard" style={{ marginBottom: 0 }}>
            <FiArrowLeft />
          </Link>
          <div className="page-title-group">
            <h1>People Registered</h1>
            <p>{registrations.length} registration{registrations.length === 1 ? '' : 's'} across {eventsWithRegistrations.length} event{eventsWithRegistrations.length === 1 ? '' : 's'}</p>
          </div>
        </div>
        <button type="button" className="btn btn-secondary" onClick={refreshRegistrations} disabled={isLoading || isRefreshing}>
          <FiRefreshCw /> {isLoading || isRefreshing ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <AdminTabs />

      {loadError && <p className="registration-list-notice" role="status">{loadError}</p>}

      <div className="filter-row" style={{ marginBottom: '1.5rem' }}>
        <div className="search-bar">
          <FiSearch />
          <input
            type="search"
            placeholder="Search by person, event, college, or year..."
            aria-label="Search registered people"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <select aria-label="Filter registrations by event" value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}>
          <option value="">All events</option>
          {eventsWithRegistrations.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading registered people...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Person</th>
                  <th>Registered Event</th>
                  <th>College</th>
                  <th>Year</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((registration, index) => (
                    <tr key={registration.id}>
                      <td>{index + 1}</td>
                      <td><strong>{registration.name}</strong></td>
                      <td>
                        <strong>{registration.event?.name || 'Event unavailable'}</strong>
                        {registration.event?.date && <div className="registered-event-date">{registration.event.date} {registration.event.time && `at ${registration.event.time}`}</div>}
                      </td>
                      <td>{registration.college || 'Not available'}</td>
                      <td>{registration.year || 'Not available'}</td>
                      <td>{formatRegisteredAt(registration.registeredAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-cell">{emptyMessage}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="registered-people-cards">
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map(registration => (
                <article className="registered-person-card" key={registration.id}>
                  <div className="registered-person-card-title"><FiUsers /> <strong>{registration.name}</strong></div>
                  <p><span>Event</span>{registration.event?.name || 'Event unavailable'}</p>
                  <p><span>College</span>{registration.college || 'Not available'}</p>
                  <p><span>Year</span>{registration.year || 'Not available'}</p>
                  <p><span>Registered</span>{formatRegisteredAt(registration.registeredAt)}</p>
                </article>
              ))
            ) : <div className="registered-people-empty">{emptyMessage}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default PeopleRegisteredPage;
