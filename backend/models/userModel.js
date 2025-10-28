const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  department: String,
  year: String,
  avatar: String,
  bio: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  uploadedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  createdPlaylists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  savedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);