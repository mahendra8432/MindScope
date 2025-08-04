const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  toggleHabitCompletion,
  deleteHabit
} = require('../controllers/habitController');

const router = express.Router();

// Validation middleware
const habitValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['health', 'mindfulness', 'productivity', 'social', 'learning'])
    .withMessage('Invalid category'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid frequency'),
  body('targetCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Target count must be at least 1'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const toggleValidation = [
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in valid ISO format'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
];

// Routes
router.route('/')
  .get(authenticate, getHabits)
  .post(authenticate, habitValidation, createHabit);

router.route('/:id')
  .get(authenticate, getHabit)
  .put(authenticate, habitValidation, updateHabit)
  .delete(authenticate, deleteHabit);

router.patch('/:id/toggle', authenticate, toggleValidation, toggleHabitCompletion);

module.exports = router;