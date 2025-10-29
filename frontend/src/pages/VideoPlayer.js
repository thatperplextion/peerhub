import React, { useState, useEffect } from 'react';import React from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';const VideoPlayer = () => {

import { ThumbsUp, ThumbsDown, Eye, Calendar, User, MessageSquare, Send, X } from 'lucide-react';  return (

    <div className="max-w-4xl mx-auto">

const VideoPlayer = () => {      <h1 className="text-3xl font-bold text-gray-900 mb-8">Video Player</h1>

  const { id } = useParams();      <div className="bg-white rounded-xl p-8 shadow-lg">

  const navigate = useNavigate();        <p className="text-gray-600">Video player functionality coming soon...</p>

  const [video, setVideo] = useState(null);      </div>

  const [comments, setComments] = useState([]);    </div>

  const [newComment, setNewComment] = useState('');  );

  const [loading, setLoading] = useState(true);};

  const [error, setError] = useState('');

export default VideoPlayer;
  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/videos/${id}`);
      setVideo(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load video');
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/comments/video/${id}`);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments');
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/videos/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVideo();
    } catch (err) {
      console.error('Failed to like video');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/comments`, {
        videoId: id,
        text: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || 'Video not found'}</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Video Player */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
          <video
            controls
            className="w-full aspect-video"
            src={`http://localhost:5000/api/videos/${video._id}/stream`}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{video.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(video.uploadDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{video.uploader?.name || 'Anonymous'}</span>
            </div>
          </div>

          {/* Like/Dislike Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all shadow-lg"
            >
              <ThumbsUp className="w-5 h-5 animate-heartbeat" />
              <span>{video.likes?.length || 0} Likes</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all">
              <ThumbsDown className="w-5 h-5" />
              <span>{video.dislikes?.length || 0}</span>
            </button>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{video.description}</p>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {comment.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">{comment.user?.name || 'User'}</span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
