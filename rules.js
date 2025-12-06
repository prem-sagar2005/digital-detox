const express = require('express');
const { Rule, Trip } = require('../models');
const authenticate = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rules/trip/:tripId
// @desc    Get all rules for a trip
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

    const rules = await Rule.findAll({
      where: { tripID: req.params.tripId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ rules });
  } catch (error) {
    console.error('Get rules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rules
// @desc    Create a new rule
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { tripID, ruleName, description, ruleType, isActive } = req.body;

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

    const rule = await Rule.create({
      tripID,
      ruleName,
      description,
      ruleType,
      isActive
    });

    res.status(201).json({ message: 'Rule created successfully', rule });
  } catch (error) {
    console.error('Create rule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/rules/:id
// @desc    Update a rule
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const rule = await Rule.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'Trip', where: { userID: req.userId } }]
    });

    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    const { ruleName, description, ruleType, isActive } = req.body;

    if (ruleName !== undefined) rule.ruleName = ruleName;
    if (description !== undefined) rule.description = description;
    if (ruleType !== undefined) rule.ruleType = ruleType;
    if (isActive !== undefined) rule.isActive = isActive;

    await rule.save();

    res.json({ message: 'Rule updated successfully', rule });
  } catch (error) {
    console.error('Update rule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/rules/:id
// @desc    Delete a rule
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const rule = await Rule.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'Trip', where: { userID: req.userId } }]
    });

    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    await rule.destroy();

    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('Delete rule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





