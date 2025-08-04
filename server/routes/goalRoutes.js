const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  toggleMilestone,
  deleteGoal
} = require('../controllers/goalController');

const router = express.Router();

// Validation middleware
const goalValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['mental-health', 'physical-health', 'relationships', 'career', 'personal-growth'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['not-started', 'in-progress', 'completed', 'paused'])
    .withMessage('Invalid status'),
  body('targetDate')
    .notEmpty()
    .withMessage('Target date is required')
    .isISO8601()
    .withMessage('Target date must be in valid ISO format'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('milestones')
    .optional()
    .isArray()
    .withMessage('Milestones must be an array')
];

// Routes
router.route('/')
  .get(authenticate, getGoals)
  .post(authenticate, goalValidation, createGoal);

router.route('/:id')
  .get(authenticate, getGoal)
  .put(authenticate, goalValidation, updateGoal)
  .delete(authenticate, deleteGoal);

router.patch('/:id/milestones/:milestoneId', authenticate, toggleMilestone);

module.exports = router;