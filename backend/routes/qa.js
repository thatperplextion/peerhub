const express = require('express');
const QuestionAnswer = require('../models/QA');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get questions for a video
router.get('/video/:videoId', auth, async (req, res) => {
  try {
    const questions = await QuestionAnswer.find({ video: req.params.videoId })
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Add question
router.post('/', auth, async (req, res) => {
  try {
    const { question, description, video, tags } = req.body;
    
    const qa = new QuestionAnswer({
      question,
      description,
      author: req.user.id,
      video,
      tags
    });

    await qa.save();
    await qa.populate('author', 'name avatar');
    
    res.status(201).json(qa);
  } catch (error) {
    res.status(500).json({ message: 'Error adding question' });
  }
});

// Add answer
router.post('/:id/answers', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const question = await QuestionAnswer.findById(req.params.id);
    question.answers.push({
      content,
      author: req.user.id
    });

    await question.save();
    await question.populate('answers.author', 'name avatar');
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error adding answer' });
  }
});

module.exports = router;