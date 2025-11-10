const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create new profile
router.post('/', async (req, res) => {
  try {
    const { name, timezone } = req.body;

    // validate name is provided
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Profile name is required' });
    }

    // check if profile with same name already exists (case-insensitive)
    const existingProfile = await Profile.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingProfile) {
      return res.status(400).json({ 
        message: `Profile with name "${name.trim()}" already exists` 
      });
    }

    const profile = new Profile({
      name: name.trim(),
      timezone: timezone || 'America/New_York'
    });

    const newProfile = await profile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update profile timezone
router.patch('/:id/timezone', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.timezone = req.body.timezone;
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
