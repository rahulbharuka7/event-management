import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import useStore from '../store/useStore';
import { TIMEZONES } from '../utils/timezones';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const CreateEvent = () => {
  const { profiles, createEvent } = useStore();
  
  const [eventName, setEventName] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState('');

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSubmit = async (e) => {
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

    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    // combine date and time, then convert to the selected timezone
    const startDateTime = dayjs.tz(`${startDate} ${startTime}`, selectedTimezone).toISOString();
    const endDateTime = dayjs.tz(`${endDate} ${endTime}`, selectedTimezone).toISOString();

    // validate that end is after start
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError('End date/time must be after start date/time');
      return;
    }

    try {
      await createEvent({
        eventName: eventName.trim(),
        eventDetails: eventDetails.trim(),
        profiles: selectedProfiles,
        timezone: selectedTimezone,
        startDateTime,
        endDateTime
      });

      // reset form
      setEventName('');
      setEventDetails('');
      setSelectedProfiles([]);
      setStartDate('');
      setStartTime('09:00');
      setEndDate('');
      setEndTime('10:00');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    }
  };

  return (
    <div className="create-event-section">
      <h2>Create Event</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
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
            {profiles.length === 0 ? (
              <div style={{ padding: '8px', color: '#999', fontSize: '14px' }}>
                No profiles available. Create one first.
              </div>
            ) : (
              profiles.map(profile => (
                <div key={profile._id} className="multi-select-item">
                  <input
                    type="checkbox"
                    id={`profile-${profile._id}`}
                    checked={selectedProfiles.includes(profile._id)}
                    onChange={() => handleProfileToggle(profile._id)}
                  />
                  <label htmlFor={`profile-${profile._id}`}>{profile.name}</label>
                </div>
              ))
            )}
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

        <button type="submit" className="btn-create">
          <Plus size={20} /> Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
