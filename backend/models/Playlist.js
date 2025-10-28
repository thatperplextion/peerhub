const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videos: [{
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    order: Number
  }],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  isCurated: {
    type: Boolean,
    default: false
  },
  coverImage: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);