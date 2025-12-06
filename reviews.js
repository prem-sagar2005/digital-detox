const express = require('express');
const { Review, Trip, User } = require('../models');
const authenticate = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/trip/:tripId
// @desc    Get all reviews for a trip
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

    const reviews = await Review.findAll({
      where: { tripID: req.params.tripId },
      include: [{ 
        model: User,
        as: 'User',
        attributes: ['username', 'fullName', 'profilePicture'] 
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { tripID, rating, reviewText, detoxSuccess } = req.body;

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

    const review = await Review.create({
      tripID,
      userID: req.userId,
      rating,
      reviewText,
      detoxSuccess
    });

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { 
        reviewID: req.params.id,
        userID: req.userId 
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const { rating, reviewText, detoxSuccess } = req.body;

    if (rating !== undefined) review.rating = rating;
    if (reviewText !== undefined) review.reviewText = reviewText;
    if (detoxSuccess !== undefined) review.detoxSuccess = detoxSuccess;

    await review.save();

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { 
        reviewID: req.params.id,
        userID: req.userId 
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





