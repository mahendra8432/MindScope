const express = require('express');
const { body } = require('express-validator');
const {
  getTips,
  getTip,
  createTip,
  updateTip,
  completeTip,
  deleteTip
} = require('../controllers/tipController');

const router = express.Router();

// Validation middleware
const tipValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be between 1 and 2000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['mindfulness', 'exercise', 'sleep', 'nutrition', 'social', 'stress', 'productivity', 'creativity'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array'),
  body('instructions')
    .optional()
    .isArray()
    .withMessage('Instructions must be an array'),
  body('resources')
    .optional()
    .isArray()
    .withMessage('Resources must be an array')
];

// Routes
router.route('/')
  .get(getTips)
  .post(tipValidation, createTip);

router.route('/:id')
  .get(getTip)
  .put(tipValidation, updateTip)
  .delete(deleteTip);

router.patch('/:id/complete', completeTip);

module.exports = router;