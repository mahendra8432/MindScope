const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
  getMoods,
  getMood,
  createMood,
  updateMood,
  deleteMood
} = require('../controllers/moodController');

const router = express.Router();

// Validation middleware
const moodValidation = [
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in valid ISO format'),
  body('moodType')
    .notEmpty()
    .withMessage('Mood type is required')
    .isIn(['excellent', 'good', 'neutral', 'poor', 'terrible'])
    .withMessage('Invalid mood type'),
  body('intensity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be between 1 and 10'),
  body('note')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Note cannot exceed 1000 characters'),
  body('energy')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Energy must be between 1 and 10'),
  body('stress')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress must be between 1 and 10'),
  body('sleep')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Sleep must be between 1 and 10'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('triggers')
    .optional()
    .isArray()
    .withMessage('Triggers must be an array'),
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array')
];

// Routes
router.route('/')
  .get(authenticate, getMoods)
  .post(authenticate, moodValidation, createMood);

router.route('/:id')
  .get(authenticate, getMood)
  .put(authenticate, moodValidation, updateMood)
  .delete(authenticate, deleteMood);

module.exports = router;