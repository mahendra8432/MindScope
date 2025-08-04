const Tip = require('../models/Tip');
const { validationResult } = require('express-validator');

// @desc    Get all tips
// @route   GET /api/tips
// @access  Public
const getTips = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, difficulty, featured, search } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tips = await Tip.find(query)
      .sort({ featured: -1, rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Tip.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: tips.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: tips
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tips',
      error: error.message
    });
  }
};

// @desc    Get single tip
// @route   GET /api/tips/:id
// @access  Public
const getTip = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    
    if (!tip) {
      return res.status(404).json({
        status: 'error',
        message: 'Tip not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: tip
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tip',
      error: error.message
    });
  }
};

// @desc    Create new tip
// @route   POST /api/tips
// @access  Public
const createTip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const tip = await Tip.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Tip created successfully',
      data: tip
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating tip',
      error: error.message
    });
  }
};

// @desc    Update tip
// @route   PUT /api/tips/:id
// @access  Public
const updateTip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const tip = await Tip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!tip) {
      return res.status(404).json({
        status: 'error',
        message: 'Tip not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Tip updated successfully',
      data: tip
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating tip',
      error: error.message
    });
  }
};

// @desc    Increment tip completion count
// @route   PATCH /api/tips/:id/complete
// @access  Public
const completeTip = async (req, res) => {
  try {
    const tip = await Tip.findByIdAndUpdate(
      req.params.id,
      { $inc: { completions: 1 } },
      { new: true, runValidators: true }
    );
    
    if (!tip) {
      return res.status(404).json({
        status: 'error',
        message: 'Tip not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Tip completion recorded',
      data: tip
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error recording tip completion',
      error: error.message
    });
  }
};

// @desc    Delete tip
// @route   DELETE /api/tips/:id
// @access  Public
const deleteTip = async (req, res) => {
  try {
    const tip = await Tip.findByIdAndDelete(req.params.id);
    
    if (!tip) {
      return res.status(404).json({
        status: 'error',
        message: 'Tip not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Tip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting tip',
      error: error.message
    });
  }
};

module.exports = {
  getTips,
  getTip,
  createTip,
  updateTip,
  completeTip,
  deleteTip
};