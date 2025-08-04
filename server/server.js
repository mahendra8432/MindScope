const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const goalRoutes = require('./routes/goalRoutes');
const habitRoutes = require('./routes/habitRoutes');
const tipRoutes = require('./routes/tipRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 10000, // 15 minutes
//   max: 10000, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ✅ 15 minutes in milliseconds
  max: 10000,               // ✅ allow up to 10,000 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,    // Good practice: adds RateLimit-* headers
  legacyHeaders: false      // Disable deprecated headers
});

app.use(limiter);


// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'MMindScope API is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔗 Backend URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;