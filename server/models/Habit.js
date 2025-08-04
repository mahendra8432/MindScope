const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    maxlength: [500, 'Note cannot exceed 500 characters'],
    default: ''
  }
}, { _id: false });

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['health', 'mindfulness', 'productivity', 'social', 'learning'],
    index: true
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  targetCount: {
    type: Number,
    required: [true, 'Target count is required'],
    min: [1, 'Target count must be at least 1'],
    default: 1
  },
  currentStreak: {
    type: Number,
    min: [0, 'Current streak cannot be negative'],
    default: 0
  },
  longestStreak: {
    type: Number,
    min: [0, 'Longest streak cannot be negative'],
    default: 0
  },
  completions: [habitCompletionSchema],
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
habitSchema.index({ isActive: 1, createdAt: -1 });
habitSchema.index({ category: 1, isActive: 1 });
habitSchema.index({ 'completions.date': 1 });

// Virtual for completion rate (last 30 days)
habitSchema.virtual('completionRate').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentCompletions = this.completions.filter(completion => {
    const completionDate = new Date(completion.date);
    return completionDate >= thirtyDaysAgo && completion.completed;
  });
  
  return Math.round((recentCompletions.length / 30) * 100);
});

// Method to calculate current streak
habitSchema.methods.calculateCurrentStreak = function() {
  const sortedCompletions = this.completions
    .filter(c => c.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    const daysDiff = Math.floor((today - completionDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === i) {
      streak++;
    } else {
      break;
    }
  }
  
  this.currentStreak = streak;
  this.longestStreak = Math.max(this.longestStreak, streak);
  return streak;
};

module.exports = mongoose.model('Habit', habitSchema);