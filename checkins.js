const express = require('express');
const { Checkin, Trip } = require('../models');
const authenticate = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/checkins/trip/:tripId
// @desc    Get all check-ins for a trip
// @access  Private
router.get('/trip/:tripId', authenticate, async (req, res) => {
  try {
    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { 
        tripID: req.params.tripId,
        userID: req.userId 
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const checkins = await Checkin.findAll({
      where: { tripID: req.params.tripId },
      order: [['checkinDate', 'DESC']]
    });

    res.json({ checkins });
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/checkins
// @desc    Create a new check-in
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { tripID, mood, stressLevel, screenTime, notes } = req.body;

    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { 
        tripID,
        userID: req.userId 
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const checkin = await Checkin.create({
      tripID,
      mood,
      stressLevel,
      screenTime,
      notes
    });

    res.status(201).json({ message: 'Check-in created successfully', checkin });
  } catch (error) {
    console.error('Create check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/checkins/:id
// @desc    Update a check-in
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const checkin = await Checkin.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'Trip', where: { userID: req.userId } }]
    });

    if (!checkin) {
      return res.status(404).json({ message: 'Check-in not found' });
    }

    const { mood, stressLevel, screenTime, notes } = req.body;

    if (mood !== undefined) checkin.mood = mood;
    if (stressLevel !== undefined) checkin.stressLevel = stressLevel;
    if (screenTime !== undefined) checkin.screenTime = screenTime;
    if (notes !== undefined) checkin.notes = notes;

    await checkin.save();

    res.json({ message: 'Check-in updated successfully', checkin });
  } catch (error) {
    console.error('Update check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/checkins/:id
// @desc    Delete a check-in
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const checkin = await Checkin.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'Trip', where: { userID: req.userId } }]
    });

    if (!checkin) {
      return res.status(404).json({ message: 'Check-in not found' });
    }

    await checkin.destroy();

    res.json({ message: 'Check-in deleted successfully' });
  } catch (error) {
    console.error('Delete check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





