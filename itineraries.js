const express = require('express');
const { Itinerary, Trip } = require('../models');
const authenticate = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/itineraries/trip/:tripId
// @desc    Get all itinerary items for a trip
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

    const itineraries = await Itinerary.findAll({
      where: { tripID: req.params.tripId },
      order: [['day', 'ASC'], ['time', 'ASC']]
    });

    res.json({ itineraries });
  } catch (error) {
    console.error('Get itineraries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/itineraries
// @desc    Create a new itinerary item
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { tripID, day, activity, time, location, description } = req.body;

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

    const itinerary = await Itinerary.create({
      tripID,
      day,
      activity,
      time,
      location,
      description
    });

    res.status(201).json({ message: 'Itinerary item created successfully', itinerary });
  } catch (error) {
    console.error('Create itinerary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/itineraries/:id
// @desc    Update an itinerary item
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const itinerary = await Itinerary.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'Trip', where: { userID: req.userId } }]
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary item not found' });
    }

    const { day, activity, time, location, description, isCompleted } = req.body;

    if (day !== undefined) itinerary.day = day;
    if (activity !== undefined) itinerary.activity = activity;
    if (time !== undefined) itinerary.time = time;
    if (location !== undefined) itinerary.location = location;
    if (description !== undefined) itinerary.description = description;
    if (isCompleted !== undefined) itinerary.isCompleted = isCompleted;

    await itinerary.save();

    res.json({ message: 'Itinerary item updated successfully', itinerary });
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/itineraries/:id
// @desc    Delete an itinerary item
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const itinerary = await Itinerary.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'Trip', where: { userID: req.userId } }]
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary item not found' });
    }

    await itinerary.destroy();

    res.json({ message: 'Itinerary item deleted successfully' });
  } catch (error) {
    console.error('Delete itinerary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





