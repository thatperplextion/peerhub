const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Video = require('../models/Video');
const Playlist = require('../models/Playlist');
const auth = require('../middleware/auth');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask', auth, async (req, res) => {
  try {
    const { question, context } = req.body;
    
    // Get relevant videos and playlists based on question
    const videos = await Video.find({
      $text: { $search: question },
      isPublic: true
    })
    .limit(5)
    .populate('uploader', 'name role');

    const playlists = await Playlist.find({
      $text: { $search: question },
      isPublic: true
    })
    .limit(3)
    .populate('creator', 'name');

    const contextData = {
      availableVideos: videos.map(video => ({
        title: video.title,
        description: video.description,
        subject: video.subject,
        topic: video.topic,
        uploader: video.uploader.name,
        duration: video.duration
      })),
      availablePlaylists: playlists.map(playlist => ({
        title: playlist.title,
        description: playlist.description,
        videoCount: playlist.videos.length
      })),
      platformFeatures: [
        "Video upload and management",
        "Playlist creation and organization",
        "Comments and Q&A sections",
        "Video transcripts and summaries",
        "Peer-to-peer learning community"
      ]
    };

    const prompt = `
      You are an AI assistant for KLH University's Peer Learning Platform. 
      Your role is to help users navigate the platform, find relevant educational content, 
      and answer questions about the platform's features.

      Context about available content:
      ${JSON.stringify(contextData, null, 2)}

      User Question: ${question}

      Please provide a helpful response focusing on:
      1. Directly answering the user's question
      2. Suggesting relevant videos or playlists from our platform
      3. Guiding them on how to use platform features
      4. Keeping responses concise and educational

      If the question is not related to the platform or KLH University syllabus, politely decline to answer.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({
      response,
      suggestedVideos: videos,
      suggestedPlaylists: playlists
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      response: "I'm having trouble processing your request right now. Please try again later.",
      suggestedVideos: [],
      suggestedPlaylists: []
    });
  }
});

module.exports = router;