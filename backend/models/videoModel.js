const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  courseCode: String,
  semester: String,
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  transcript: {
    text: String,
    generatedAt: Date
  },
  summary: {
    text: String,
    generatedAt: Date
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  processingStatus: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  }
}, {
  timestamps: true
});

videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ subject: 1, topic: 1 });

module.exports = mongoose.model('Video', videoSchema);