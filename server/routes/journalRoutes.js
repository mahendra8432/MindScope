const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal
} = require('../controllers/journalController');

const router = express.Router();

// Validation middleware
const journalValidation = [
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in valid ISO format'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('mood')
    .optional()
    .isIn(['positive', 'neutral', 'negative'])
    .withMessage('Invalid mood value'),
  body('category')
    .optional()
    .isIn(['reflection', 'gratitude', 'goals', 'challenges', 'memories', 'dreams'])
    .withMessage('Invalid category'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean')
];

// Routes
router.route('/')
  .get(authenticate, getJournals)
  .post(authenticate, journalValidation, createJournal);

router.route('/:id')
  .get(authenticate, getJournal)
  .put(authenticate, journalValidation, updateJournal)
  .delete(authenticate, deleteJournal);

module.exports = router;