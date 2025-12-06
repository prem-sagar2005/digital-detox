const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const checkinRoutes = require('./routes/checkins');
const itineraryRoutes = require('./routes/itineraries');
const ruleRoutes = require('./routes/rules');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Digital Detox API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.ensureDatabaseExists();
    console.log(`✓ Database "${sequelize.config.database}" ensured to exist`);

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync models with database (creates tables if they don't exist)
    await sequelize.sync();
    console.log('✓ Database synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;





