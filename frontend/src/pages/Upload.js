import React, { useState } from 'react';import React, { useState } from 'react';import React from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';import { useNavigate } from 'react-router-dom';

import { Upload as UploadIcon, FileVideo, Image, X, Tag, BookOpen, Code, CheckCircle } from 'lucide-react';

import axios from 'axios';const Upload = () => {

const Upload = () => {

  const navigate = useNavigate();import { Upload as UploadIcon, FileVideo, Image, X, Tag, BookOpen, Code, CheckCircle } from 'lucide-react';  return (

  const [formData, setFormData] = useState({

    title: '',    <div className="max-w-4xl mx-auto">

    description: '',

    subject: '',const Upload = () => {      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Video</h1>

    topic: '',

    courseCode: '',  const navigate = useNavigate();      <div className="bg-white rounded-xl p-8 shadow-lg">

    semester: '',

    tags: '',  const [formData, setFormData] = useState({        <p className="text-gray-600">Video upload functionality coming soon...</p>

  });

  const [videoFile, setVideoFile] = useState(null);    title: '',      </div>

  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [videoPreview, setVideoPreview] = useState(null);    description: '',    </div>

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [uploading, setUploading] = useState(false);    subject: '',  );

  const [uploadProgress, setUploadProgress] = useState(0);

  const [error, setError] = useState('');    topic: '',};

  const [success, setSuccess] = useState(false);

    courseCode: '',

  const subjects = [

    'Computer Science',    semester: '',export default Upload;

    'Mathematics',    tags: '',

    'Physics',  });

    'Chemistry',  const [videoFile, setVideoFile] = useState(null);

    'Electronics',  const [thumbnailFile, setThumbnailFile] = useState(null);

    'Mechanical Engineering',  const [videoPreview, setVideoPreview] = useState(null);

    'Civil Engineering',  const [thumbnailPreview, setThumbnailPreview] = useState(null);

    'Other'  const [uploading, setUploading] = useState(false);

  ];  const [uploadProgress, setUploadProgress] = useState(0);

  const [error, setError] = useState('');

  const handleChange = (e) => {  const [success, setSuccess] = useState(false);

    setFormData({

      ...formData,  const subjects = [

      [e.target.name]: e.target.value,    'Computer Science',

    });    'Mathematics',

  };    'Physics',

    'Chemistry',

  const handleVideoChange = (e) => {    'Electronics',

    const file = e.target.files[0];    'Mechanical Engineering',

    if (file) {    'Civil Engineering',

      setVideoFile(file);    'Other'

      setVideoPreview(URL.createObjectURL(file));  ];

    }

  };  const handleChange = (e) => {

    setFormData({

  const handleThumbnailChange = (e) => {      ...formData,

    const file = e.target.files[0];      [e.target.name]: e.target.value,

    if (file) {    });

      setThumbnailFile(file);  };

      setThumbnailPreview(URL.createObjectURL(file));

    }  const handleVideoChange = (e) => {

  };    const file = e.target.files[0];

    if (file) {

  const removeVideo = () => {      setVideoFile(file);

    setVideoFile(null);      setVideoPreview(URL.createObjectURL(file));

    setVideoPreview(null);    }

  };  };



  const removeThumbnail = () => {  const handleThumbnailChange = (e) => {

    setThumbnailFile(null);    const file = e.target.files[0];

    setThumbnailPreview(null);    if (file) {

  };      setThumbnailFile(file);

      setThumbnailPreview(URL.createObjectURL(file));

  const handleSubmit = async (e) => {    }

    e.preventDefault();  };

    

    if (!videoFile) {  const removeVideo = () => {

      setError('Please select a video file');    setVideoFile(null);

      return;    setVideoPreview(null);

    }  };



    const uploadData = new FormData();  const removeThumbnail = () => {

    uploadData.append('video', videoFile);    setThumbnailFile(null);

    if (thumbnailFile) uploadData.append('thumbnail', thumbnailFile);    setThumbnailPreview(null);

    uploadData.append('title', formData.title);  };

    uploadData.append('description', formData.description);

    uploadData.append('subject', formData.subject);  const handleSubmit = async (e) => {

    uploadData.append('topic', formData.topic);    e.preventDefault();

    uploadData.append('courseCode', formData.courseCode);    

    uploadData.append('semester', formData.semester);    if (!videoFile) {

    uploadData.append('tags', formData.tags);      setError('Please select a video file');

      return;

    try {    }

      setUploading(true);

      setError('');    const uploadData = new FormData();

      const token = localStorage.getItem('token');    uploadData.append('video', videoFile);

          if (thumbnailFile) uploadData.append('thumbnail', thumbnailFile);

      await axios.post('http://localhost:5000/api/videos/upload', uploadData, {    uploadData.append('title', formData.title);

        headers: {    uploadData.append('description', formData.description);

          'Content-Type': 'multipart/form-data',    uploadData.append('subject', formData.subject);

          'Authorization': `Bearer ${token}`,    uploadData.append('topic', formData.topic);

        },    uploadData.append('courseCode', formData.courseCode);

        onUploadProgress: (progressEvent) => {    uploadData.append('semester', formData.semester);

          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);    uploadData.append('tags', formData.tags);

          setUploadProgress(progress);

        },    try {

      });      setUploading(true);

      setError('');

      setSuccess(true);      const token = localStorage.getItem('token');

      setTimeout(() => {      

        navigate('/');      await axios.post('http://localhost:5000/api/videos/upload', uploadData, {

      }, 2000);        headers: {

    } catch (err) {          'Content-Type': 'multipart/form-data',

      setError(err.response?.data?.message || 'Upload failed. Please try again.');          'Authorization': `Bearer ${token}`,

      setUploadProgress(0);        },

    } finally {        onUploadProgress: (progressEvent) => {

      setUploading(false);          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

    }          setUploadProgress(progress);

  };        },

      });

  if (success) {

    return (      setSuccess(true);

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">      setTimeout(() => {

        <div className="bg-white p-12 rounded-2xl shadow-2xl text-center animate-scale-in">        navigate('/');

          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />      }, 2000);

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Successful!</h2>    } catch (err) {

          <p className="text-gray-600">Your video is being processed...</p>      setError(err.response?.data?.message || 'Upload failed. Please try again.');

        </div>      setUploadProgress(0);

      </div>    } finally {

    );      setUploading(false);

  }    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">  if (success) {

      <div className="max-w-4xl mx-auto">    return (

        <div className="bg-white p-10 rounded-2xl shadow-2xl">      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">

          <div className="text-center mb-8">        <div className="bg-white p-12 rounded-2xl shadow-2xl text-center animate-scale-in">

            <div className="flex justify-center mb-4">          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg animate-bounce">          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Successful!</h2>

                <FileVideo className="w-12 h-12 text-white" />          <p className="text-gray-600">Your video is being processed...</p>

              </div>        </div>

            </div>      </div>

            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">    );

              Upload Video  }

            </h2>

            <p className="mt-2 text-gray-600">Share your knowledge with the community</p>  return (

          </div>    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">

      <div className="max-w-4xl mx-auto">

          {error && (        <div className="bg-white p-10 rounded-2xl shadow-2xl">

            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-shake">          <div className="text-center mb-8">

              {error}            <div className="flex justify-center mb-4">

            </div>              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg animate-bounce">

          )}                <FileVideo className="w-12 h-12 text-white" />

              </div>

          <form onSubmit={handleSubmit} className="space-y-6">            </div>

            <div>            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">

              <label className="block text-sm font-medium text-gray-700 mb-2">Video File *</label>              Upload Video

              {!videoFile ? (            </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer group">            <p className="mt-2 text-gray-600">Share your knowledge with the community</p>

                  <input          </div>

                    type="file"

                    accept="video/*"          {error && (

                    onChange={handleVideoChange}            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-shake">

                    className="hidden"              {error}

                    id="video-upload"            </div>

                  />          )}

                  <label htmlFor="video-upload" className="cursor-pointer">

                    <FileVideo className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:animate-wiggle" />          <form onSubmit={handleSubmit} className="space-y-6">

                    <p className="text-gray-600 font-medium">Click to upload video</p>            {/* Video Upload */}

                    <p className="text-sm text-gray-500 mt-2">MP4, AVI, MOV up to 500MB</p>            <div>

                  </label>              <label className="block text-sm font-medium text-gray-700 mb-2">Video File *</label>

                </div>              {!videoFile ? (

              ) : (                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer group">

                <div className="relative bg-gray-100 rounded-xl p-4">                  <input

                  <button                    type="file"

                    type="button"                    accept="video/*"

                    onClick={removeVideo}                    onChange={handleVideoChange}

                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"                    className="hidden"

                  >                    id="video-upload"

                    <X className="w-4 h-4" />                  />

                  </button>                  <label htmlFor="video-upload" className="cursor-pointer">

                  <video src={videoPreview} controls className="w-full rounded-lg" />                    <FileVideo className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:animate-wiggle" />

                  <p className="mt-2 text-sm text-gray-600">{videoFile.name}</p>                    <p className="text-gray-600 font-medium">Click to upload video</p>

                </div>                    <p className="text-sm text-gray-500 mt-2">MP4, AVI, MOV up to 500MB</p>

              )}                  </label>

            </div>                </div>

              ) : (

            <div>                <div className="relative bg-gray-100 rounded-xl p-4">

              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (Optional)</label>                  <button

              {!thumbnailFile ? (                    type="button"

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors cursor-pointer group">                    onClick={removeVideo}

                  <input                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"

                    type="file"                  >

                    accept="image/*"                    <X className="w-4 h-4" />

                    onChange={handleThumbnailChange}                  </button>

                    className="hidden"                  <video src={videoPreview} controls className="w-full rounded-lg" />

                    id="thumbnail-upload"                  <p className="mt-2 text-sm text-gray-600">{videoFile.name}</p>

                  />                </div>

                  <label htmlFor="thumbnail-upload" className="cursor-pointer">              )}

                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2 group-hover:animate-jiggle" />            </div>

                    <p className="text-sm text-gray-600">Upload custom thumbnail</p>

                  </label>            {/* Thumbnail Upload */}

                </div>            <div>

              ) : (              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (Optional)</label>

                <div className="relative bg-gray-100 rounded-xl p-4">              {!thumbnailFile ? (

                  <button                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors cursor-pointer group">

                    type="button"                  <input

                    onClick={removeThumbnail}                    type="file"

                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"                    accept="image/*"

                  >                    onChange={handleThumbnailChange}

                    <X className="w-4 h-4" />                    className="hidden"

                  </button>                    id="thumbnail-upload"

                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full rounded-lg" />                  />

                </div>                  <label htmlFor="thumbnail-upload" className="cursor-pointer">

              )}                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2 group-hover:animate-jiggle" />

            </div>                    <p className="text-sm text-gray-600">Upload custom thumbnail</p>

                  </label>

            <div>                </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>              ) : (

              <input                <div className="relative bg-gray-100 rounded-xl p-4">

                type="text"                  <button

                name="title"                    type="button"

                required                    onClick={removeThumbnail}

                value={formData.title}                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"

                onChange={handleChange}                  >

                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"                    <X className="w-4 h-4" />

                placeholder="Enter video title"                  </button>

              />                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full rounded-lg" />

            </div>                </div>

              )}

            <div>            </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>

              <textarea            {/* Title & Description */}

                name="description"            <div>

                required              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>

                value={formData.description}              <input

                onChange={handleChange}                type="text"

                rows="4"                name="title"

                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"                required

                placeholder="Describe your video content"                value={formData.title}

              />                onChange={handleChange}

            </div>                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"

                placeholder="Enter video title"

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              />

              <div>            </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>

                <div className="relative group">            <div>

                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-wiggle" />              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>

                  <select              <textarea

                    name="subject"                name="description"

                    required                required

                    value={formData.subject}                value={formData.description}

                    onChange={handleChange}                onChange={handleChange}

                    className="w-full pl-12 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"                rows="4"

                  >                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"

                    <option value="">Select Subject</option>                placeholder="Describe your video content"

                    {subjects.map(sub => (              />

                      <option key={sub} value={sub}>{sub}</option>            </div>

                    ))}

                  </select>            {/* Subject & Topic */}

                </div>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              </div>              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>

              <div>                <div className="relative group">

                <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-wiggle" />

                <input                  <select

                  type="text"                    name="subject"

                  name="topic"                    required

                  required                    value={formData.subject}

                  value={formData.topic}                    onChange={handleChange}

                  onChange={handleChange}                    className="w-full pl-12 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"

                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"                  >

                  placeholder="e.g., Data Structures"                    <option value="">Select Subject</option>

                />                    {subjects.map(sub => (

              </div>                      <option key={sub} value={sub}>{sub}</option>

            </div>                    ))}

                  </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                </div>

              <div>              </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>

                <div className="relative group">              <div>

                  <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-jiggle" />                <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>

                  <input                <input

                    type="text"                  type="text"

                    name="courseCode"                  name="topic"

                    value={formData.courseCode}                  required

                    onChange={handleChange}                  value={formData.topic}

                    className="w-full pl-12 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"                  onChange={handleChange}

                    placeholder="e.g., CS101"                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"

                  />                  placeholder="e.g., Data Structures"

                </div>                />

              </div>              </div>

            </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>            {/* Course Code & Semester */}

                <input            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  type="text"              <div>

                  name="semester"                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>

                  value={formData.semester}                <div className="relative group">

                  onChange={handleChange}                  <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-jiggle" />

                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"                  <input

                  placeholder="e.g., Fall 2024"                    type="text"

                />                    name="courseCode"

              </div>                    value={formData.courseCode}

            </div>                    onChange={handleChange}

                    className="w-full pl-12 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"

            <div>                    placeholder="e.g., CS101"

              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>                  />

              <div className="relative group">                </div>

                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-wiggle" />              </div>

                <input

                  type="text"              <div>

                  name="tags"                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>

                  value={formData.tags}                <input

                  onChange={handleChange}                  type="text"

                  className="w-full pl-12 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"                  name="semester"

                  placeholder="e.g., tutorial, beginner, programming"                  value={formData.semester}

                />                  onChange={handleChange}

              </div>                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"

            </div>                  placeholder="e.g., Fall 2024"

                />

            {uploading && (              </div>

              <div className="space-y-2">            </div>

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Uploading...</span>            {/* Tags */}

                  <span>{uploadProgress}%</span>            <div>

                </div>              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>

                <div className="w-full bg-gray-200 rounded-full h-3">              <div className="relative group">

                  <div                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-wiggle" />

                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"                <input

                    style={{ width: `${uploadProgress}%` }}                  type="text"

                  />                  name="tags"

                </div>                  value={formData.tags}

              </div>                  onChange={handleChange}

            )}                  className="w-full pl-12 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"

                  placeholder="e.g., tutorial, beginner, programming"

            <button                />

              type="submit"              </div>

              disabled={uploading}            </div>

              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"

            >            {/* Upload Progress */}

              {uploading ? (            {uploading && (

                <>              <div className="space-y-2">

                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">                <div className="flex justify-between text-sm text-gray-600">

                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>                  <span>Uploading...</span>

                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>                  <span>{uploadProgress}%</span>

                  </svg>                </div>

                  Uploading {uploadProgress}%                <div className="w-full bg-gray-200 rounded-full h-3">

                </>                  <div

              ) : (                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"

                <>                    style={{ width: `${uploadProgress}%` }}

                  <UploadIcon className="w-5 h-5 mr-2" />                  />

                  Upload Video                </div>

                </>              </div>

              )}            )}

            </button>

          </form>            {/* Submit Button */}

        </div>            <button

      </div>              type="submit"

    </div>              disabled={uploading}

  );              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"

};            >

              {uploading ? (

export default Upload;                <>

                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading {uploadProgress}%
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
