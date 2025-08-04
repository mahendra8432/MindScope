const Mood = require('../models/Mood');
const { validationResult } = require('express-validator');

// @desc    Get all moods
// @route   GET /api/moods
// @access  Public
const getMoods = async (req, res) => {
  try {
    const { page = 1, limit = 50, moodType, startDate, endDate } = req.query;
    
    // Build query
    let query = { userId: req.user._id };
    
    if (moodType) {
      query.moodType = moodType;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    
    const moods = await Mood.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Mood.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: moods.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: moods
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching moods',
      error: error.message
    });
  }
};

// @desc    Get single mood
// @route   GET /api/moods/:id
// @access  Public
const getMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    
    if (!mood) {
      return res.status(404).json({
        status: 'error',
        message: 'Mood not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching mood',
      error: error.message
    });
  }
};

// @desc    Create new mood
// @route   POST /api/moods
// @access  Public
const createMood = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const mood = await Mood.create({
      ...req.body,
      userId: req.user._id
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Mood created successfully',
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating mood',
      error: error.message
    });
  }
};

// @desc    Update mood
// @route   PUT /api/moods/:id
// @access  Public
const updateMood = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const mood = await Mood.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );
    
    if (!mood) {
      return res.status(404).json({
        status: 'error',
        message: 'Mood not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Mood updated successfully',
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating mood',
      error: error.message
    });
  }
};

// @desc    Delete mood
// @route   DELETE /api/moods/:id
// @access  Public
const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!mood) {
      return res.status(404).json({
        status: 'error',
        message: 'Mood not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Mood deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting mood',
      error: error.message
    });
  }
};

module.exports = {
  getMoods,
  getMood,
  createMood,
  updateMood,
  deleteMood
};