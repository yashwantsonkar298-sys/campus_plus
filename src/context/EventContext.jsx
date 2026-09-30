import React, { createContext, useState, useEffect, useContext } from 'react';
import { initialEvents } from '../data/eventsData';

export const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('clubEvents');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialEvents;
  });

  useEffect(() => {
    localStorage.setItem('clubEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    const event = {
      ...newEvent,
      id: Date.now().toString(),
      registrations: []
    };
    setEvents((prev) => [...prev, event]);
  };

  const editEvent = (id, updatedData) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updatedData } : ev))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const registerForEvent = async (eventId, registrationData, requestId) => {
    const event = events.find(ev => ev.id === eventId);
    if (!event) throw new Error('Event not found.');
    let response;
    let result;
    try {
      response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'CampusPlus' },
        body: JSON.stringify({
          requestId,
          event: { id: String(event.id), name: event.name, date: event.date, time: event.time, venue: event.venue },
          registration: registrationData,
        }),
        signal: AbortSignal.timeout(20000),
      });
      result = await response.json();
    } catch {
      throw new Error('Could not confirm registration. Please try again with the same details.');
    }
    if (!response.ok) throw new Error(result.error || 'Registration failed. Please try again.');
    if (!result.registration?.id || !result.registration.notifications) {
      throw new Error('Could not confirm registration. Please try again with the same details.');
    }
    const newReg = result.registration;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            registrations: [...(ev.registrations || []).filter(reg =>
              reg.id !== newReg.id && reg.email?.toLowerCase() !== newReg.email
            ), newReg]
          };
        }
        return ev;
      })
    );
    return result;
  };

  const getEventRegistrations = (eventId) => {
    const event = events.find((ev) => ev.id === eventId);
    return event ? event.registrations : [];
  };

  const searchEvents = (query) => {
    if (!query) return events;
    const lowerQuery = query.toLowerCase();
    return events.filter(
      (ev) =>
        ev.name.toLowerCase().includes(lowerQuery) ||
        ev.description.toLowerCase().includes(lowerQuery) ||
        ev.venue.toLowerCase().includes(lowerQuery)
    );
  };

  const filterByCategory = (category, eventList = events) => {
    if (!category || category === 'All') return eventList;
    return eventList.filter((ev) => ev.category === category);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        editEvent,
        deleteEvent,
        registerForEvent,
        getEventRegistrations,
        searchEvents,
        filterByCategory
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
