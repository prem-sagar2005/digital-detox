const sequelize = require('../config/database');
const User = require('./User');
const Trip = require('./Trip');
const Checkin = require('./Checkin');
const Itinerary = require('./Itinerary');
const Rule = require('./Rule');
const Review = require('./Review');

// Define associations
User.hasMany(Trip, { foreignKey: 'userID', onDelete: 'CASCADE', as: 'Trips' });
Trip.belongsTo(User, { foreignKey: 'userID', as: 'User' });

Trip.hasMany(Checkin, { foreignKey: 'tripID', onDelete: 'CASCADE', as: 'Checkins' });
Checkin.belongsTo(Trip, { foreignKey: 'tripID', as: 'Trip' });

Trip.hasMany(Itinerary, { foreignKey: 'tripID', onDelete: 'CASCADE', as: 'Itineraries' });
Itinerary.belongsTo(Trip, { foreignKey: 'tripID', as: 'Trip' });

Trip.hasMany(Rule, { foreignKey: 'tripID', onDelete: 'CASCADE', as: 'Rules' });
Rule.belongsTo(Trip, { foreignKey: 'tripID', as: 'Trip' });

Trip.hasMany(Review, { foreignKey: 'tripID', onDelete: 'CASCADE', as: 'Reviews' });
Review.belongsTo(Trip, { foreignKey: 'tripID', as: 'Trip' });

User.hasMany(Review, { foreignKey: 'userID', onDelete: 'CASCADE', as: 'Reviews' });
Review.belongsTo(User, { foreignKey: 'userID', as: 'User' });

module.exports = {
  sequelize,
  User,
  Trip,
  Checkin,
  Itinerary,
  Rule,
  Review
};





