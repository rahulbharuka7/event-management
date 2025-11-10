import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, History } from 'lucide-react';
import useStore from '../store/useStore';
import { TIMEZONES } from '../utils/timezones';
import EditEventModal from './EditEventModal';
import UpdateLogsModal from './UpdateLogsModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventsList = () => {
  const { selectedProfile, events, updateProfileTimezone } = useStore();
  const [viewTimezone, setViewTimezone] = useState('America/New_York');
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogs, setViewingLogs] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    if (selectedProfile) {
      setViewTimezone(selectedProfile.timezone);
    }
  }, [selectedProfile]);

  const handleTimezoneChange = async (newTimezone) => {
    setViewTimezone(newTimezone);
    if (selectedProfile) {
      await updateProfileTimezone(selectedProfile._id, newTimezone);
    }
  };

  const formatDateTime = (dateTime, tz) => {
    return dayjs(dateTime).tz(tz).format('MMM D, YYYY • hh:mm A');
  };

  const formatTimestamp = (timestamp, tz) => {
    return dayjs(timestamp).tz(tz).format('MMM D, YYYY hh:mm A');
  };

  // separate upcoming and past events
  const now = dayjs();
  const upcomingEvents = events.filter(event => dayjs(event.endDateTime).isAfter(now));
  const pastEvents = events.filter(event => dayjs(event.endDateTime).isBefore(now));
  const displayEvents = showPastEvents ? pastEvents : upcomingEvents;

  if (!selectedProfile) {
    return (
      <div className="events-section">
        <h2>Events</h2>
        <div className="no-events">
          Please select a profile to view events
        </div>
      </div>
    );
  }

  return (
    <div className="events-section">
      <div className="events-header">
        <h2>Events</h2>
        <div className="timezone-selector">
          <label>View in Timezone</label>
          <select value={viewTimezone} onChange={(e) => handleTimezoneChange(e.target.value)}>
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="events-toggle">
        <button 
          className={`toggle-btn ${!showPastEvents ? 'active' : ''}`}
          onClick={() => setShowPastEvents(false)}
        >
          <Calendar size={16} />
          Upcoming ({upcomingEvents.length})
        </button>
        <button 
          className={`toggle-btn ${showPastEvents ? 'active' : ''}`}
          onClick={() => setShowPastEvents(true)}
        >
          <History size={16} />
          Past ({pastEvents.length})
        </button>
      </div>

      {displayEvents.length === 0 ? (
        <div className="no-events">
          {showPastEvents ? 'No past events' : 'No upcoming events'}
        </div>
      ) : (
        <div className="events-list">
          {displayEvents.map(event => (
            <div 
              key={event._id} 
              className="event-card"
              onClick={() => setEditingEvent(event)}
            >
              <div className="event-name">
                <Calendar size={18} />
                {event.eventName}
              </div>
              {event.eventDetails && (
                <div className="event-details">
                  {event.eventDetails}
                </div>
              )}
              <div className="event-profiles">
                <Users size={14} />
                <span>{event.profiles.map(p => p.name).join(', ')}</span>
              </div>
              <div className="event-time">
                <Clock size={14} />
                <span><strong>Start:</strong> {formatDateTime(event.startDateTime, viewTimezone)}</span>
              </div>
              <div className="event-time">
                <Clock size={14} />
                <span><strong>End:</strong> {formatDateTime(event.endDateTime, viewTimezone)}</span>
              </div>
              <div className="event-footer">
                <span>Created: {formatTimestamp(event.createdAt, viewTimezone)}</span>
                {event.updateLogs && event.updateLogs.length > 0 && (
                  <button 
                    className="btn-view-logs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingLogs(event);
                    }}
                  >
                    <History size={14} />
                    View Logs
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          viewTimezone={viewTimezone}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {viewingLogs && (
        <UpdateLogsModal
          event={viewingLogs}
          viewTimezone={viewTimezone}
          onClose={() => setViewingLogs(null)}
        />
      )}
    </div>
  );
};

export default EventsList;
