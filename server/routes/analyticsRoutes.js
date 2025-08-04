const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getDashboardAnalytics,
  getMoodTrends
} = require('../controllers/analyticsController');

const router = express.Router();

// Routes
router.get('/dashboard', authenticate, getDashboardAnalytics);
router.get('/mood-trends', authenticate, getMoodTrends);

module.exports = router;