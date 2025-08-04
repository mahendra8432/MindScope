const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    index: true
  },
  moodType: {
    type: String,
    required: [true, 'Mood type is required'],
    enum: ['excellent', 'good', 'neutral', 'poor', 'terrible'],
    index: true
  },
  note: {
    type: String,
    maxlength: [1000, 'Note cannot exceed 1000 characters'],
    default: ''
  },
  intensity: {
    type: Number,
    required: [true, 'Intensity is required'],
    min: [1, 'Intensity must be at least 1'],
    max: [10, 'Intensity cannot exceed 10']
  },
  energy: {
    type: Number,
    min: [1, 'Energy must be at least 1'],
    max: [10, 'Energy cannot exceed 10'],
    default: 5
  },
  stress: {
    type: Number,
    min: [1, 'Stress must be at least 1'],
    max: [10, 'Stress cannot exceed 10'],
    default: 5
  },
  sleep: {
    type: Number,
    min: [1, 'Sleep must be at least 1'],
    max: [10, 'Sleep cannot exceed 10'],
    default: 7
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  triggers: [{
    type: String,
    trim: true,
    maxlength: [100, 'Trigger cannot exceed 100 characters']
  }],
  activities: [{
    type: String,
    trim: true,
    maxlength: [100, 'Activity cannot exceed 100 characters']
  }],
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  weather: {
    type: String,
    trim: true,
    maxlength: [50, 'Weather cannot exceed 50 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
moodSchema.index({ date: -1 });
moodSchema.index({ moodType: 1, date: -1 });
moodSchema.index({ createdAt: -1 });

// Virtual for mood value (for calculations)
moodSchema.virtual('moodValue').get(function() {
  const moodValues = {
    excellent: 5,
    good: 4,
    neutral: 3,
    poor: 2,
    terrible: 1
  };
  return moodValues[this.moodType];
});

module.exports = mongoose.model('Mood', moodSchema);