import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages - Student Side
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';

// Pages - Admin Side
import AdminDashboard from './pages/AdminDashboard';
import AddEventPage from './pages/AddEventPage';
import EditEventPage from './pages/EditEventPage';
import ViewRegistrationsPage from './pages/ViewRegistrationsPage';
import PeopleRegisteredPage from './pages/PeopleRegisteredPage';

function App() {
  return (
    <div className="app-container">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1b4b',
            color: '#f8fafc',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#f8fafc',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f8fafc',
            },
          },
        }}
      />
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Student Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add" element={<AddEventPage />} />
          <Route path="/admin/edit/:id" element={<EditEventPage />} />
          <Route path="/admin/registrations/:id" element={<ViewRegistrationsPage />} />
          <Route path="/admin/people" element={<PeopleRegisteredPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
