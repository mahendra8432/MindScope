const Goal = require('../models/Goal');
const { validationResult } = require('express-validator');

// @desc    Get all goals
// @route   GET /api/goals
// @access  Public
const getGoals = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, priority } = req.query;
    
    // Build query
    let query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    const goals = await Goal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Goal.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: goals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching goals',
      error: error.message
    });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Public
const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching goal',
      error: error.message
    });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Public
const createGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const goal = await Goal.create({
      ...req.body,
      userId: req.user._id
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating goal',
      error: error.message
    });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Public
const updateGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );
    
    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating goal',
      error: error.message
    });
  }
};

// @desc    Toggle milestone completion
// @route   PATCH /api/goals/:id/milestones/:milestoneId
// @access  Public
const toggleMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    
    const goal = await Goal.findOne({ _id: id, userId: req.user._id });
    
    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }
    
    const milestone = goal.milestones.id(milestoneId);
    
    if (!milestone) {
      return res.status(404).json({
        status: 'error',
        message: 'Milestone not found'
      });
    }
    
    // Toggle milestone completion
    milestone.completed = !milestone.completed;
    milestone.completedAt = milestone.completed ? new Date() : null;
    
    await goal.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Milestone updated successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating milestone',
      error: error.message
    });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Public
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({
        status: 'error',
        message: 'Goal not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting goal',
      error: error.message
    });
  }
};

module.exports = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  toggleMilestone,
  deleteGoal
};