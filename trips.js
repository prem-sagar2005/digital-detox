const express = require('express');
const { Trip, Checkin, Itinerary, Rule, Review, User } = require('../models');
const authenticate = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/trips
// @desc    Get all trips for authenticated user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { userID: req.userId },
      order: [['startDate', 'DESC']],
      include: [
        { model: Checkin, as: 'Checkins' },
        { model: Itinerary, as: 'Itineraries' },
        { model: Rule, as: 'Rules' }
      ]
    });

    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { 
        tripID: req.params.id,
        userID: req.userId 
      },
      include: [
        { model: Checkin, as: 'Checkins', order: [['checkinDate', 'DESC']] },
        { model: Itinerary, as: 'Itineraries', order: [['day', 'ASC'], ['time', 'ASC']] },
        { model: Rule, as: 'Rules' },
        { model: Review, as: 'Reviews', include: [{ model: User, as: 'User', attributes: ['username', 'fullName'] }] }
      ]
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { destination, startDate, endDate, description, coverImage } = req.body;

    const trip = await Trip.create({
      userID: req.userId,
      destination,
      startDate,
      endDate,
      description,
      coverImage
    });

    res.status(201).json({ message: 'Trip created successfully', trip });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update a trip
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { 
        tripID: req.params.id,
        userID: req.userId 
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const { destination, startDate, endDate, description, status, coverImage } = req.body;

    if (destination !== undefined) trip.destination = destination;
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;
    if (description !== undefined) trip.description = description;
    if (status !== undefined) trip.status = status;
    if (coverImage !== undefined) trip.coverImage = coverImage;

    await trip.save();

    res.json({ message: 'Trip updated successfully', trip });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { 
        tripID: req.params.id,
        userID: req.userId 
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await trip.destroy();

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





