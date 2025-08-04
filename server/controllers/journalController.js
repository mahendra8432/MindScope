const Journal = require('../models/Journal');
const { validationResult } = require('express-validator');

// @desc    Get all journal entries
// @route   GET /api/journals
// @access  Public
const getJournals = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, mood, search } = req.query;
    
    // Build query
    let query = { userId: req.user._id };
    
    if (category) {
      query.category = category;
    }
    
    if (mood) {
      query.mood = mood;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const journals = await Journal.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Journal.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: journals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: journals
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching journal entries',
      error: error.message
    });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journals/:id
// @access  Public
const getJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({
        status: 'error',
        message: 'Journal entry not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: journal
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching journal entry',
      error: error.message
    });
  }
};

// @desc    Create new journal entry
// @route   POST /api/journals
// @access  Public
const createJournal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const journal = await Journal.create({
      ...req.body,
      userId: req.user._id
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Journal entry created successfully',
      data: journal
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating journal entry',
      error: error.message
    });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journals/:id
// @access  Public
const updateJournal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );
    
    if (!journal) {
      return res.status(404).json({
        status: 'error',
        message: 'Journal entry not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Journal entry updated successfully',
      data: journal
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating journal entry',
      error: error.message
    });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journals/:id
// @access  Public
const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!journal) {
      return res.status(404).json({
        status: 'error',
        message: 'Journal entry not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting journal entry',
      error: error.message
    });
  }
};

module.exports = {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal
};