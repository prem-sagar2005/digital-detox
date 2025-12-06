const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Checkin = sequelize.define('Checkin', {
  checkinID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tripID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'tripID'
    }
  },
  checkinDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  mood: {
    type: DataTypes.ENUM('happy', 'relaxed', 'energetic', 'peaceful', 'stressed', 'anxious', 'neutral'),
    allowNull: false
  },
  stressLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 10
    }
  },
  screenTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Screen time in minutes'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'checkins',
  timestamps: false
});

module.exports = Checkin;

















