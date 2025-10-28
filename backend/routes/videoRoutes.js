const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Video = require('../models/videoModel');
const User = require('../models/userModel');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Multer configuration for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Upload video
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    const { title, description, subject, topic, courseCode, semester, tags } = req.body;
    
    // Create default thumbnail (you can replace with actual thumbnail generation)
    const thumbnailName = `thumbnail-${Date.now()}.jpg`;
    
    // For now, use a default duration (in production, you'd extract this from video metadata)
    const duration = 0; // Will be updated when client provides it or use a library

    const video = new Video({
      title,
      description,
      filename: req.file.filename,
      thumbnail: thumbnailName,
      duration: duration,
      size: req.file.size,
      uploader: req.user.id,
      subject,
      topic,
      courseCode,
      semester,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      processingStatus: 'processing'
    });

    await video.save();

    // Add video to user's uploaded videos
    await User.findByIdAndUpdate(req.user.id, {
      $push: { uploadedVideos: video._id }
    });

    // Generate transcript and summary in background
    setTimeout(() => generateTranscriptAndSummary(video._id), 1000);

    res.status(201).json({
      success: true,
      video,
      message: 'Video uploaded successfully! Processing transcript and summary...'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video: ' + error.message
    });
  }
});

// Generate transcript and summary
async function generateTranscriptAndSummary(videoId) {
  try {
    // Simulate transcript generation
    // In production, integrate with Google Speech-to-Text API or similar
    const sampleTranscript = `This is an educational video about the topic. 
    The content covers key concepts and provides detailed explanations. 
    Students can learn important information from this video content.`;
    
    // Generate summary using Gemini if API key is available
    let summary = "Summary will be generated once video transcript is available.";
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Please provide a concise 3-4 sentence summary of this educational video content: ${sampleTranscript}`;
        const result = await model.generateContent(prompt);
        summary = result.response.text();
      } catch (apiError) {
        console.log('Gemini API not configured or error:', apiError.message);
      }
    }

    await Video.findByIdAndUpdate(videoId, {
      transcript: { 
        text: sampleTranscript, 
        generatedAt: new Date(),
        method: 'auto-generated' 
      },
      summary: { 
        text: summary, 
        generatedAt: new Date() 
      },
      processingStatus: 'completed'
    });

    console.log(`✅ Transcript and summary generated for video: ${videoId}`);

  } catch (error) {
    console.error('Error generating transcript/summary:', error);
    await Video.findByIdAndUpdate(videoId, {
      processingStatus: 'failed',
      processingError: error.message
    });
  }
}

// Get all videos
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 12, subject, topic, search } = req.query;
    
    const query = { isPublic: true };
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (search) {
      query.$text = { $search: search };
    }

    const videos = await Video.find(query)
      .populate('uploader', 'name avatar universityId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Video.countDocuments(query);

    res.json({
      videos,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

// Get single video
router.get('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'name avatar universityId role')
      .populate('likes', 'name avatar')
      .populate('dislikes', 'name avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching video' });
  }
});

// Like/Dislike video
router.post('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const hasLiked = video.likes.includes(req.user.id);
    const hasDisliked = video.dislikes.includes(req.user.id);

    if (hasLiked) {
      video.likes.pull(req.user.id);
    } else {
      video.likes.push(req.user.id);
      if (hasDisliked) {
        video.dislikes.pull(req.user.id);
      }
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error updating like' });
  }
});

router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const hasLiked = video.likes.includes(req.user.id);
    const hasDisliked = video.dislikes.includes(req.user.id);

    if (hasDisliked) {
      video.dislikes.pull(req.user.id);
    } else {
      video.dislikes.push(req.user.id);
      if (hasLiked) {
        video.likes.pull(req.user.id);
      }
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error updating dislike' });
  }
});

module.exports = router;