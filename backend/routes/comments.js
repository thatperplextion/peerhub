const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const router = express.Router();

// Get comments for a video
router.get('/video/:videoId', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('author', 'name avatar')
      .populate('replies')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Add comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, video, parentComment, timestamp } = req.body;
    
    const comment = new Comment({
      content,
      author: req.user.id,
      video,
      parentComment,
      timestamp
    });

    await comment.save();
    await comment.populate('author', 'name avatar');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Like comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const hasLiked = comment.likes.includes(req.user.id);

    if (hasLiked) {
      comment.likes.pull(req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error updating like' });
  }
});

module.exports = router;