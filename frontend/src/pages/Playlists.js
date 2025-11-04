import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Play, Video, Trash2, Edit, Lock, Globe, Eye, Clock, Share2 } from 'lucide-react';
import DarkNavbar from '../components/Layout/DarkNavbar';

const Playlists = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    privacy: 'public'
  });

  // Mock playlists data
  const playlists = [
    {
      id: 1,
      name: 'Data Structures & Algorithms',
      description: 'Complete DSA course for beginners',
      videoCount: 12,
      privacy: 'public',
      thumbnail: null,
      createdAt: '2024-01-15',
      views: 234
    },
    {
      id: 2,
      name: 'Mathematics Fundamentals',
      description: 'Calculus and Linear Algebra basics',
      videoCount: 8,
      privacy: 'private',
      thumbnail: null,
      createdAt: '2024-01-20',
      views: 156
    },
    {
      id: 3,
      name: 'Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript and React',
      videoCount: 15,
      privacy: 'public',
      thumbnail: null,
      createdAt: '2024-02-01',
      views: 389
    }
  ];

  const handleCreatePlaylist = () => {
    // TODO: Implement API call to create playlist
    console.log('Creating playlist:', newPlaylist);
    setShowCreateModal(false);
    setNewPlaylist({ name: '', description: '', privacy: 'public' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <DarkNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-2">
              My Playlists
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Organize and manage your video collections</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Playlist
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Video className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-800">{playlists.length}</span>
            </div>
            <p className="text-sm text-gray-600">Total Playlists</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Play className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-800">
                {playlists.reduce((acc, p) => acc + p.videoCount, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Videos</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-800">
                {playlists.reduce((acc, p) => acc + p.views, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-800">
                {playlists.filter(p => p.privacy === 'public').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Public</p>
          </div>
        </div>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Video className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No playlists yet</h3>
            <p className="text-gray-600 mb-6">Start organizing your videos by creating your first playlist</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Create Your First Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all group"
              >
                {/* Playlist Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all" />
                  <Play className="w-16 h-16 text-white relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute top-4 right-4 z-20">
                    {playlist.privacy === 'public' ? (
                      <Globe className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-sm px-3 py-1 rounded-full z-20">
                    {playlist.videoCount} videos
                  </div>
                </div>

                {/* Playlist Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {playlist.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{playlist.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/playlist/${playlist.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                      <Play className="w-4 h-4" />
                      Play All
                    </Link>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all group/btn">
                      <Share2 className="w-5 h-5 text-gray-400 group-hover/btn:text-green-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all group/btn">
                      <Edit className="w-5 h-5 text-gray-400 group-hover/btn:text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all group/btn">
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover/btn:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Playlist</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Playlist Name *
                  </label>
                  <input
                    type="text"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Web Development Basics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    placeholder="Describe your playlist..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy
                  </label>
                  <select
                    value={newPlaylist.privacy}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, privacy: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="private">Private - Only you can view</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlists;
