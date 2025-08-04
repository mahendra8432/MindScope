const Habit = require('../models/Habit');
const { validationResult } = require('express-validator');

// @desc    Get all habits
// @route   GET /api/habits
// @access  Public
const getHabits = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isActive = true } = req.query;
    
    // Build query
    let query = { userId: req.user._id, isActive: isActive === 'true' };
    
    if (category) {
      query.category = category;
    }
    
    const habits = await Habit.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Habit.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: habits.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: habits
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching habits',
      error: error.message
    });
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Public
const getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({
        status: 'error',
        message: 'Habit not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: habit
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching habit',
      error: error.message
    });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Public
const createHabit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const habit = await Habit.create({
      ...req.body,
      userId: req.user._id
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Habit created successfully',
      data: habit
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating habit',
      error: error.message
    });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Public
const updateHabit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );
    
    if (!habit) {
      return res.status(404).json({
        status: 'error',
        message: 'Habit not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Habit updated successfully',
      data: habit
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating habit',
      error: error.message
    });
  }
};

// @desc    Toggle habit completion for a specific date
// @route   PATCH /api/habits/:id/toggle
// @access  Public
const toggleHabitCompletion = async (req, res) => {
  try {
    const { date, note = '' } = req.body;
    
    if (!date) {
      return res.status(400).json({
        status: 'error',
        message: 'Date is required'
      });
    }
    
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!habit) {
      return res.status(404).json({
        status: 'error',
        message: 'Habit not found'
      });
    }
    
    // Find existing completion for the date
    const existingCompletion = habit.completions.find(c => c.date === date);
    
    if (existingCompletion) {
      // Toggle existing completion
      existingCompletion.completed = !existingCompletion.completed;
      existingCompletion.note = note;
    } else {
      // Add new completion
      habit.completions.push({
        date,
        completed: true,
        note
      });
    }
    
    // Recalculate streaks
    habit.calculateCurrentStreak();
    
    await habit.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Habit completion updated successfully',
      data: habit
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating habit completion',
      error: error.message
    });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Public
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!habit) {
      return res.status(404).json({
        status: 'error',
        message: 'Habit not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting habit',
      error: error.message
    });
  }
};

module.exports = {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  toggleHabitCompletion,
  deleteHabit
};