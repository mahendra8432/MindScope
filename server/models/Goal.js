const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true,
    maxlength: [200, 'Milestone title cannot exceed 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}, { _id: true });

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['mental-health', 'physical-health', 'relationships', 'career', 'personal-growth'],
    index: true
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['not-started', 'in-progress', 'completed', 'paused'],
    default: 'not-started',
    index: true
  },
  targetDate: {
    type: String,
    required: [true, 'Target date is required']
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot exceed 100'],
    default: 0
  },
  milestones: [milestoneSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
goalSchema.index({ status: 1, createdAt: -1 });
goalSchema.index({ category: 1, priority: 1 });
goalSchema.index({ targetDate: 1 });
goalSchema.index({ createdAt: -1 });

// Virtual for completion percentage based on milestones
goalSchema.virtual('milestoneProgress').get(function() {
  if (this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(m => m.completed).length;
  return Math.round((completed / this.milestones.length) * 100);
});

// Pre-save middleware to auto-update progress and status
goalSchema.pre('save', function(next) {
  if (this.isModified('milestones')) {
    // Update progress based on completed milestones
    if (this.milestones.length > 0) {
      const completedMilestones = this.milestones.filter(m => m.completed).length;
      this.progress = Math.round((completedMilestones / this.milestones.length) * 100);
      
      // Auto-complete goal if all milestones are completed
      if (completedMilestones === this.milestones.length && this.status !== 'completed') {
        this.status = 'completed';
      }
    }
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);