const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// get all events for a specific profile
router.get('/profile/:profileId', async (req, res) => {
  try {
    const events = await Event.find({ 
      profiles: req.params.profileId 
    }).populate('profiles').sort({ startDateTime: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('profiles');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new event
router.post('/', async (req, res) => {
  const { eventName, eventDetails, profiles, timezone, startDateTime, endDateTime } = req.body;

  // validate required fields
  if (!eventName || !eventName.trim()) {
    return res.status(400).json({ 
      message: 'Event name is required' 
    });
  }

  // validate end time is after start time
  if (new Date(endDateTime) <= new Date(startDateTime)) {
    return res.status(400).json({ 
      message: 'End date/time must be after start date/time' 
    });
  }

  const event = new Event({
    eventName: eventName.trim(),
    eventDetails: eventDetails ? eventDetails.trim() : '',
    profiles,
    timezone,
    startDateTime: new Date(startDateTime),
    endDateTime: new Date(endDateTime)
  });

  try {
    const newEvent = await event.save();
    const populatedEvent = await Event.findById(newEvent._id).populate('profiles');
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update event
router.patch('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const changes = {};
    const oldValues = {};

    // track what changed for update logs
    if (req.body.eventName && req.body.eventName.trim() !== event.eventName) {
      oldValues.eventName = event.eventName;
      changes.eventName = { from: event.eventName, to: req.body.eventName.trim() };
      event.eventName = req.body.eventName.trim();
    }

    if (req.body.eventDetails !== undefined && req.body.eventDetails.trim() !== event.eventDetails) {
      oldValues.eventDetails = event.eventDetails;
      changes.eventDetails = { from: event.eventDetails, to: req.body.eventDetails.trim() };
      event.eventDetails = req.body.eventDetails.trim();
    }

    if (req.body.profiles && JSON.stringify(req.body.profiles) !== JSON.stringify(event.profiles)) {
      oldValues.profiles = event.profiles;
      changes.profiles = { 
        from: event.profiles.map(p => p.toString()), 
        to: req.body.profiles 
      };
      event.profiles = req.body.profiles;
    }

    if (req.body.timezone && req.body.timezone !== event.timezone) {
      oldValues.timezone = event.timezone;
      changes.timezone = { from: event.timezone, to: req.body.timezone };
      event.timezone = req.body.timezone;
    }

    if (req.body.startDateTime) {
      const newStart = new Date(req.body.startDateTime);
      if (newStart.getTime() !== event.startDateTime.getTime()) {
        oldValues.startDateTime = event.startDateTime;
        changes.startDateTime = { 
          from: event.startDateTime.toISOString(), 
          to: newStart.toISOString() 
        };
        event.startDateTime = newStart;
      }
    }

    if (req.body.endDateTime) {
      const newEnd = new Date(req.body.endDateTime);
      if (newEnd.getTime() !== event.endDateTime.getTime()) {
        oldValues.endDateTime = event.endDateTime;
        changes.endDateTime = { 
          from: event.endDateTime.toISOString(), 
          to: newEnd.toISOString() 
        };
        event.endDateTime = newEnd;
      }
    }

    // validate end time is still after start time
    if (event.endDateTime <= event.startDateTime) {
      return res.status(400).json({ 
        message: 'End date/time must be after start date/time' 
      });
    }

    // add update log if there were changes
    if (Object.keys(changes).length > 0) {
      event.updateLogs.push({
        changes: changes,
        timestamp: new Date()
      });
    }

    const updatedEvent = await event.save();
    const populatedEvent = await Event.findById(updatedEvent._id).populate('profiles');
    res.json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
