const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rule = sequelize.define('Rule', {
  ruleID: {
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
  ruleName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ruleType: {
    type: DataTypes.ENUM('device_free_zones', 'time_limits', 'app_restrictions', 'emergency_only', 'custom'),
    defaultValue: 'custom'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'rules',
  timestamps: false
});

module.exports = Rule;

















