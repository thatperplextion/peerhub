const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Video = require('../models/Video');
const User = require('../models/User');
const auth = require('../middleware/auth');
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
    const { title, description, subject, topic, courseCode, semester, tags } = req.body;
    
    // Get video duration and create thumbnail
    const getVideoInfo = () => {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(req.file.path, (err, metadata) => {
          if (err) reject(err);
          resolve(metadata);
        });
      });
    };

    const createThumbnail = () => {
      return new Promise((resolve, reject) => {
        const thumbnailName = `thumbnail-${Date.now()}.jpg`;
        const thumbnailPath = `uploads/thumbnails/${thumbnailName}`;
        
        ffmpeg(req.file.path)
          .screenshots({
            timestamps: ['00:00:01'],
            filename: thumbnailName,
            folder: 'uploads/thumbnails/',
            size: '640x360'
          })
          .on('end', () => resolve(thumbnailName))
          .on('error', reject);
      });
    };

    const videoInfo = await getVideoInfo();
    const thumbnail = await createThumbnail();
    const duration = Math.round(videoInfo.format.duration);

    const video = new Video({
      title,
      description,
      filename: req.file.filename,
      thumbnail,
      duration,
      size: req.file.size,
      uploader: req.user.id,
      subject,
      topic,
      courseCode,
      semester,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await video.save();

    // Add video to user's uploaded videos
    await User.findByIdAndUpdate(req.user.id, {
      $push: { uploadedVideos: video._id }
    });

    // Generate transcript and summary in background
    generateTranscriptAndSummary(video._id, req.file.path);

    res.status(201).json({
      success: true,
      video,
      message: 'Video uploaded successfully! Processing transcript and summary...'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video'
    });
  }
});

// Generate transcript and summary
async function generateTranscriptAndSummary(videoId, videoPath) {
  try {
    // Note: For actual implementation, you'd use a speech-to-text service
    // This is a simplified version
    const transcript = "Transcript generation would be implemented with Google Speech-to-Text or similar service";
    
    // Generate summary using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Please provide a concise summary of the following video content: ${transcript}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    await Video.findByIdAndUpdate(videoId, {
      transcript: { text: transcript, generatedAt: new Date() },
      summary: { text: summary, generatedAt: new Date() },
      processingStatus: 'completed'
    });

  } catch (error) {
    console.error('Error generating transcript/summary:', error);
    await Video.findByIdAndUpdate(videoId, {
      processingStatus: 'failed'
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