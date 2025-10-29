import React, { useState, useEffect } from 'react';import React from 'react';

import { useParams, useNavigate, Link } from 'react-router-dom';

import axios from 'axios';const VideoPlayer = () => {

import {   return (

  ThumbsUp, ThumbsDown, Eye, Calendar, User, MessageSquare, Send,     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">

  X, HelpCircle, CheckCircle, ArrowLeft, Share2, Save, Play,      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">

  FileText, Clock, TrendingUp, Star        <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Player</h1>

} from 'lucide-react';        <p className="text-gray-600">Video player functionality coming soon...</p>

import EnhancedNavbar from '../components/Layout/EnhancedNavbar';      </div>

    </div>

const VideoPlayer = () => {  );

  const { id } = useParams();};

  const navigate = useNavigate();

  const [video, setVideo] = useState(null);export default VideoPlayer;

  const [comments, setComments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });
  const [newAnswer, setNewAnswer] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchComments();
    fetchQuestions();
    fetchRelatedVideos();
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

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/qa/video/${id}`);
      setQuestions(data);
    } catch (err) {
      console.error('Failed to load questions');
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/videos?limit=5`);
      setRelatedVideos((data.videos || data).filter(v => v._id !== id).slice(0, 4));
    } catch (err) {
      console.error('Failed to load related videos');
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like videos');
        return;
      }
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
      if (!token) {
        alert('Please login to comment');
        return;
      }
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

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to ask questions');
        return;
      }
      await axios.post(`http://localhost:5000/api/qa`, {
        videoId: id,
        title: newQuestion.title,
        description: newQuestion.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewQuestion({ title: '', description: '' });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to add question');
    }
  };

  const handleAddAnswer = async (questionId) => {
    if (!newAnswer[questionId]?.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to answer questions');
        return;
      }
      await axios.post(`http://localhost:5000/api/qa/${questionId}/answer`, {
        text: newAnswer[questionId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewAnswer({ ...newAnswer, [questionId]: '' });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to add answer');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-screen">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <EnhancedNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
              <video
                controls
                className="w-full aspect-video"
                src={`http://localhost:5000/uploads/videos/${video.filename}`}
                poster={video.thumbnail ? `http://localhost:5000/uploads/thumbnails/${video.thumbnail}` : undefined}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{video.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span>{formatDate(video.uploadDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>{formatDuration(video.duration)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all shadow-lg"
                >
                  <ThumbsUp className="w-5 h-5 group-hover:animate-heartbeat" />
                  <span>{video.likes?.length || 0} Likes</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all">
                  <ThumbsDown className="w-5 h-5" />
                  <span>{video.dislikes?.length || 0}</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transform hover:scale-105 transition-all">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transform hover:scale-105 transition-all">
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>

              {/* Uploader Info */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {video.uploader?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{video.uploader?.name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-600">{video.uploader?.department} • {video.uploader?.role}</p>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">{video.description}</p>
              </div>

              {/* Course Info */}
              {(video.courseCode || video.semester) && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {video.courseCode && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Course Code</p>
                      <p className="font-semibold text-blue-700">{video.courseCode}</p>
                    </div>
                  )}
                  {video.semester && (
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Semester</p>
                      <p className="font-semibold text-green-700">{video.semester}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium hover:from-blue-200 hover:to-purple-200 cursor-pointer transition-all"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript & Summary */}
              {(video.transcript || video.summary) && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    {showTranscript ? 'Hide' : 'Show'} Transcript & Summary
                  </button>
                  
                  {showTranscript && (
                    <div className="mt-4 space-y-4">
                      {video.summary && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-gray-800 mb-2">📝 AI Summary</h4>
                          <p className="text-gray-700">{video.summary}</p>
                        </div>
                      )}
                      {video.transcript && (
                        <div className="bg-gray-50 p-4 rounded-xl max-h-96 overflow-y-auto">
                          <h4 className="font-semibold text-gray-800 mb-2">📄 Full Transcript</h4>
                          <p className="text-gray-700 whitespace-pre-wrap text-sm">{video.transcript}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs: Comments & Q&A */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === 'comments'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Comments ({comments.length})
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === 'qa'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <HelpCircle className="w-5 h-5 inline mr-2" />
                  Q&A ({questions.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'comments' ? (
                  <div>
                    {/* Add Comment */}
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
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {comment.user?.name?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-semibold text-gray-900">{comment.user?.name || 'User'}</span>
                                  <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-gray-700 mb-2">{comment.text}</p>
                                <div className="flex items-center gap-4">
                                  <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    {comment.likes?.length || 0}
                                  </button>
                                  {localStorage.getItem('user') && 
                                   JSON.parse(localStorage.getItem('user'))?.id === comment.user?._id && (
                                    <button
                                      onClick={() => handleDeleteComment(comment._id)}
                                      className="text-sm text-red-600 hover:text-red-800"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Add Question */}
                    <form onSubmit={handleAddQuestion} className="mb-8 space-y-4">
                      <input
                        type="text"
                        value={newQuestion.title}
                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        placeholder="Question title..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <textarea
                        value={newQuestion.description}
                        onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                        placeholder="Question description..."
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                      >
                        <HelpCircle className="w-5 h-5" />
                        Ask Question
                      </button>
                    </form>

                    {/* Questions List */}
                    <div className="space-y-6">
                      {questions.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No questions yet. Be the first to ask!</p>
                      ) : (
                        questions.map((question) => (
                          <div key={question._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {question.user?.name?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{question.title}</h4>
                                <p className="text-gray-600 text-sm mb-2">{question.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{question.user?.name || 'User'}</span>
                                  <span>{formatDate(question.createdAt)}</span>
                                  {question.acceptedAnswer && (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                      <CheckCircle className="w-4 h-4" />
                                      Answered
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Answers */}
                            {question.answers && question.answers.length > 0 && (
                              <div className="ml-14 space-y-4 mb-4">
                                {question.answers.map((answer) => (
                                  <div
                                    key={answer._id}
                                    className={`p-4 rounded-xl ${
                                      answer._id === question.acceptedAnswer
                                        ? 'bg-green-50 border-2 border-green-300'
                                        : 'bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium text-gray-900">{answer.user?.name || 'User'}</span>
                                      {answer._id === question.acceptedAnswer && (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                      )}
                                    </div>
                                    <p className="text-gray-700">{answer.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Answer */}
                            <div className="ml-14 flex gap-2">
                              <input
                                type="text"
                                value={newAnswer[question._id] || ''}
                                onChange={(e) => setNewAnswer({ ...newAnswer, [question._id]: e.target.value })}
                                placeholder="Write an answer..."
                                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => handleAddAnswer(question._id)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                              >
                                Answer
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Related Videos
              </h3>
              <div className="space-y-4">
                {relatedVideos.map((relVideo) => (
                  <Link
                    key={relVideo._id}
                    to={`/video/${relVideo._id}`}
                    className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-purple-400 to-pink-400">
                      {relVideo.thumbnail ? (
                        <img
                          src={`http://localhost:5000/uploads/thumbnails/${relVideo.thumbnail}`}
                          alt={relVideo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Play className="w-12 h-12 text-white opacity-70" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relVideo.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {relVideo.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(relVideo.duration)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
