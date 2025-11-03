import React, { useState } from 'react';
import { useQuery } from '@tantml:function_calls';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, TrendingUp, Clock, Star, Play, Eye, Sparkles, Trophy, Users, Video as VideoIcon, Rocket, BookMarked } from 'lucide-react';
import EnhancedVideoCard from '../components/Video/EnhancedVideoCard';
import DarkNavbar from '../components/Layout/DarkNavbar';

const EnhancedHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('recent');
    const [showTrending, setShowTrending] = useState(true);

    const { data: videos = [], isLoading, isError } = useQuery({
        queryKey: ['videos', searchTerm, subjectFilter],
        queryFn: async () => {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (subjectFilter) params.subject = subjectFilter;

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/videos', { 
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Videos fetched:', response.data);
                return response.data.videos || response.data || [];
            } catch (error) {
                console.error('Error fetching videos:', error);
                return [];
            }
        }
    });

    const subjects = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering'];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300">
            <DarkNavbar />
            
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4 animate-slide-up">
                        Welcome to KLH PeerHub
                    </h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">Discover, Learn, and Grow Together</p>
                    <p className="text-gray-600 dark:text-gray-400">Access thousands of educational videos created by students, for students</p>
                    
                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-8 flex-wrap">
                        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer">
                            <div className="flex items-center justify-center mb-2">
                                <Play className="w-8 h-8 text-emerald-500 group-hover:animate-bounce" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">{videos.length}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                        </div>
                        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer">
                            <div className="flex items-center justify-center mb-2">
                                <Eye className="w-8 h-8 text-cyan-500 group-hover:animate-wiggle" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">
                                {videos.reduce((acc, v) => acc + (v.views || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                        </div>
                        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="w-8 h-8 text-yellow-500 group-hover:animate-spin" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">
                                {videos.reduce((acc, v) => acc + (v.likes?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                        </div>
                        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="w-8 h-8 text-purple-500 group-hover:animate-bounce" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">100+</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                        </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Link to="/upload" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                            <Rocket className="w-5 h-5 animate-bounce" />
                            Upload Video
                        </Link>
                        <Link to="/playlists" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                            <BookMarked className="w-5 h-5 animate-wiggle" />
                            My Playlists
                        </Link>
                        <button 
                            onClick={() => setShowTrending(!showTrending)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            <Trophy className="w-5 h-5 animate-spin-slow" />
                            {showTrending ? 'Hide' : 'Show'} Trending
                        </button>
                    </div>
                </div>

                {/* Trending Section */}
                {showTrending && videos.length > 0 && (
                    <div className="mb-8 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 dark:from-orange-500/20 dark:via-pink-500/20 dark:to-purple-500/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-orange-500 dark:text-orange-400 animate-pulse" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Trending Now</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {videos.slice(0, 3).map((video, index) => (
                                <Link 
                                    key={video._id}
                                    to={`/video/${video._id}`}
                                    className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-md hover:shadow-xl transition-all transform hover:scale-105"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl font-bold text-orange-500">#{index + 1}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{video.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{video.views || 0} views</p>
                                        </div>
                                        <TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400 animate-bounce" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 mb-8 transform hover:shadow-2xl transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Videos</label>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-hover:animate-jiggle group-focus-within:animate-jiggle" />
                                <input
                                    type="text"
                                    placeholder="Search by title, topic, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Subject Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                            <div className="relative group">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-hover:animate-wiggle group-focus-within:animate-wiggle" />
                                <select
                                    value={subjectFilter}
                                    onChange={(e) => setSubjectFilter(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none transition-all duration-300"
                                >
                                    <option value="">All Subjects</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none transition-all duration-300"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="popular">Most Popular</option>
                                <option value="trending">Trending</option>
                                <option value="views">Most Viewed</option>
                            </select>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-white">{videos.length}</span> videos found
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">View:</span>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-300 group ${
                                    viewMode === 'grid'
                                        ? 'bg-emerald-500 text-white shadow-lg scale-110'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <Grid className="w-5 h-5 group-hover:animate-flip" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all duration-300 group ${
                                    viewMode === 'list'
                                        ? 'bg-emerald-500 text-white shadow-lg scale-110'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <List className="w-5 h-5 group-hover:animate-flip" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Videos Grid/List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
                            <p className="text-center mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading awesome content...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                        <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Oops! Something went wrong</h3>
                        <p className="text-red-600 dark:text-red-400">Unable to load videos. Please try again later.</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-12 text-center">
                        <div className="text-emerald-400 text-6xl mb-4">🎥</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No videos found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSubjectFilter('');
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4'
                    }>
                        {videos.map((video, index) => (
                            <div
                                key={video._id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <EnhancedVideoCard video={video} viewMode={viewMode} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-8 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">© 2024 KLH PeerHub.</p>
                    <p className="text-gray-500 text-sm mt-2">Empowering collaborative learning at KLH University</p>
                </div>
            </footer>
        </div>
    );
};

export default EnhancedHome;
