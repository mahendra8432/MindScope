const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  mood: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: null
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['reflection', 'gratitude', 'goals', 'challenges', 'memories', 'dreams'],
    default: 'reflection'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  },
  attachments: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
journalSchema.index({ date: -1 });
journalSchema.index({ title: 'text', content: 'text' });
journalSchema.index({ tags: 1 });
journalSchema.index({ category: 1, date: -1 });
journalSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate word count and reading time
journalSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Calculate word count
    this.wordCount = this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Calculate reading time (average 200 words per minute)
    this.readingTime = Math.ceil(this.wordCount / 200);
  }
  next();
});

module.exports = mongoose.model('Journal', journalSchema);