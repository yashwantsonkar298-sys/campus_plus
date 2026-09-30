import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { FiArrowLeft, FiDownload, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { notificationLabels } from '../lib/registration';

const ViewRegistrationsPage = () => {
  const { id } = useParams();
  const { events, getEventRegistrations } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const event = events.find(e => e.id === id || e.id.toString() === id);
  const registrations = event ? getEventRegistrations(event.id) : [];

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch =
      (reg.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (reg.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter ? reg.year === yearFilter : true;
    return matchesSearch && matchesYear;
  });

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast.error('No registrations to export');
      return;
    }

    const headers = ['S.No', 'Name', 'Email', 'College', 'Year', 'Phone', 'Registered At'];
    const csvRows = [
      headers.join(','),
      ...filteredRegistrations.map((reg, index) => [
        index + 1,
        `"${reg.name || ''}"`,
        `"${reg.email || ''}"`,
        `"${reg.college || ''}"`,
        `"${reg.year || ''}"`,
        `"${reg.phone || ''}"`,
        `"${reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : 'N/A'}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event?.name?.replace(/\s+/g, '_')}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV!');
  };

  if (!event) {
    return (
      <div className="registrations-page">
        <div className="error-state">
          <p>Event not found</p>
          <Link to="/admin" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="registrations-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/admin" className="back-link" style={{ marginBottom: 0 }}>
            <FiArrowLeft />
          </Link>
          <div className="page-title-group">
            <h1>{event.name}</h1>
            <p>Registrations ({registrations.length})</p>
          </div>
        </div>
        <button onClick={handleExportCSV} className="btn btn-success">
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="filter-row" style={{ marginBottom: '1.5rem' }}>
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Year</th>
              <th>Phone</th>
              <th>Registered At</th>
              <th>Confirmations</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((reg, index) => (
                <tr key={reg.id || index}>
                  <td>{index + 1}</td>
                  <td><strong>{reg.name}</strong></td>
                  <td>{reg.email}</td>
                  <td>{reg.college}</td>
                  <td>{reg.year}</td>
                  <td>{reg.phone}</td>
                  <td>{reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : 'N/A'}</td>
                  <td>
                    {reg.notifications ? ['email', 'sms'].map(channel => (
                      <div key={channel}>
                        {channel === 'email' ? 'Email' : 'SMS'}: {notificationLabels[reg.notifications[channel]?.status] || notificationLabels.unknown}
                      </div>
                    )) : 'Not recorded'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-cell">
                  {registrations.length === 0
                    ? 'No registrations yet for this event.'
                    : 'No registrations match your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRegistrationsPage;
