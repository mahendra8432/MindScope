const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['mindfulness', 'exercise', 'sleep', 'nutrition', 'social', 'stress', 'productivity', 'creativity'],
    index: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
    index: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 4.0
  },
  completions: {
    type: Number,
    min: [0, 'Completions cannot be negative'],
    default: 0
  },
  benefits: [{
    type: String,
    trim: true,
    maxlength: [100, 'Benefit cannot exceed 100 characters']
  }],
  instructions: [{
    type: String,
    trim: true,
    maxlength: [500, 'Instruction cannot exceed 500 characters']
  }],
  resources: [{
    type: String,
    trim: true,
    maxlength: [200, 'Resource cannot exceed 200 characters']
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
tipSchema.index({ category: 1, difficulty: 1 });
tipSchema.index({ featured: 1, rating: -1 });
tipSchema.index({ isActive: 1, createdAt: -1 });
tipSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Tip', tipSchema);