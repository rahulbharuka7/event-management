import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { TIMEZONES } from '../utils/timezones';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditEventModal = ({ event, viewTimezone, onClose }) => {
  const { profiles, updateEvent, deleteEvent } = useStore();
  
  const [eventName, setEventName] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // initialize form with event data
    setEventName(event.eventName || '');
    setEventDetails(event.eventDetails || '');
    setSelectedProfiles(event.profiles.map(p => p._id));
    setSelectedTimezone(event.timezone);

    // convert event times to the event's timezone for editing
    const startInTz = dayjs(event.startDateTime).tz(event.timezone);
    const endInTz = dayjs(event.endDateTime).tz(event.timezone);

    setStartDate(startInTz.format('YYYY-MM-DD'));
    setStartTime(startInTz.format('HH:mm'));
    setEndDate(endInTz.format('YYYY-MM-DD'));
    setEndTime(endInTz.format('HH:mm'));
  }, [event]);

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!eventName.trim()) {
      setError('Please enter an event name');
      return;
    }

    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile');
      return;
    }

    // combine date and time in the selected timezone
    const startDateTime = dayjs.tz(`${startDate} ${startTime}`, selectedTimezone).toISOString();
    const endDateTime = dayjs.tz(`${endDate} ${endTime}`, selectedTimezone).toISOString();

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError('End date/time must be after start date/time');
      return;
    }

    try {
      await updateEvent(event._id, {
        eventName: eventName.trim(),
        eventDetails: eventDetails.trim(),
        profiles: selectedProfiles,
        timezone: selectedTimezone,
        startDateTime,
        endDateTime
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update event');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(event._id);
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to delete event');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Event</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Event Name *</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              required
            />
          </div>

          <div className="form-group">
            <label>Event Details</label>
            <textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="Enter event description (optional)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Profiles</label>
            <div className="multi-select">
              {profiles.map(profile => (
                <div key={profile._id} className="multi-select-item">
                  <input
                    type="checkbox"
                    id={`edit-profile-${profile._id}`}
                    checked={selectedProfiles.includes(profile._id)}
                    onChange={() => handleProfileToggle(profile._id)}
                  />
                  <label htmlFor={`edit-profile-${profile._id}`}>{profile.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select 
              value={selectedTimezone} 
              onChange={(e) => setSelectedTimezone(e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date & Time</label>
            <div className="datetime-group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>End Date & Time</label>
            <div className="datetime-group">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-delete" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-update">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
