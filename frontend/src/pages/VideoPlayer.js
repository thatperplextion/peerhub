import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ThumbsUp, ThumbsDown, Eye, Calendar, User, MessageSquare, 
  Send, X, HelpCircle, CheckCircle, ArrowLeft, Share2, 
  Save, Play, FileText, Clock, TrendingUp, Star 
} from 'lucide-react';
import EnhancedNavbar from '../components/Layout/EnhancedNavbar';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    &lt;div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"&gt;
      &lt;EnhancedNavbar /&gt;
      &lt;div className="max-w-7xl mx-auto px-4 py-8"&gt;
        &lt;h1 className="text-3xl font-bold text-gray-900"&gt;Video Player&lt;/h1&gt;
        &lt;p className="text-gray-600 mt-4"&gt;Video ID: {id}&lt;/p&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default VideoPlayer;
