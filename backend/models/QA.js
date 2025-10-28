const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  description: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  answers: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  isResolved: {
    type: Boolean,
    default: false
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('QuestionAnswer', questionAnswerSchema);