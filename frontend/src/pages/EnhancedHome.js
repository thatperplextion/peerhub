import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Filter, Grid, List, TrendingUp, Clock, Star, Play, Eye } from 'lucide-react';
import EnhancedVideoCard from '../components/Video/EnhancedVideoCard';
import EnhancedNavbar from '../components/Layout/EnhancedNavbar';

const EnhancedHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('recent');

    const { data: videos = [], isLoading, isError } = useQuery({
        queryKey: ['videos', searchTerm, subjectFilter],
        queryFn: async () => {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (subjectFilter) params.subject = subjectFilter;

            try {
                const response = await axios.get('http://localhost:5000/api/videos', { params });
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <EnhancedNavbar />
            
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-slide-up">
                        Welcome to KLH PeerHub
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">Discover, Learn, and Grow Together</p>
                    <p className="text-gray-500">Access thousands of educational videos created by students, for students</p>
                    
                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-8 flex-wrap">
                        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer">
                            <div className="flex items-center justify-center mb-2">
                                <Play className="w-8 h-8 text-blue-600 group-hover:animate-bounce" />
                            </div>
                            <p className="text-3xl font-bold text-gray-800 animate-pulse">{videos.length}</p>
                            <p className="text-sm text-gray-600">Total Videos</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer">
                            <div className="flex items-center justify-center mb-2">
                                <Eye className="w-8 h-8 text-green-600 group-hover:animate-wiggle" />
                            </div>
                            <p className="text-3xl font-bold text-gray-800 animate-pulse">
                                {videos.reduce((acc, v) => acc + (v.views || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600">Total Views</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="w-8 h-8 text-yellow-600 group-hover:animate-spin" />
                            </div>
                            <p className="text-3xl font-bold text-gray-800 animate-pulse">
                                {videos.reduce((acc, v) => acc + (v.likes?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600">Total Likes</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transform hover:shadow-2xl transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Videos</label>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-jiggle group-focus-within:animate-jiggle" />
                                <input
                                    type="text"
                                    placeholder="Search by title, topic, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Subject Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <div className="relative group">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:animate-wiggle group-focus-within:animate-wiggle" />
                                <select
                                    value={subjectFilter}
                                    onChange={(e) => setSubjectFilter(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-300"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-300"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="popular">Most Popular</option>
                                <option value="trending">Trending</option>
                                <option value="views">Most Viewed</option>
                            </select>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            <span className="font-semibold text-gray-800">{videos.length}</span> videos found
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 mr-2">View:</span>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-300 group ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Grid className="w-5 h-5 group-hover:animate-flip" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all duration-300 group ${
                                    viewMode === 'list'
                                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-center mt-4 text-gray-600 font-medium">Loading awesome content...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                        <p className="text-red-600">Unable to load videos. Please try again later.</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
                        <div className="text-blue-400 text-6xl mb-4">🎥</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No videos found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
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
                    <p className="text-gray-400">© 2024 KLH PeerHub. Built with ❤️ by students, for students.</p>
                    <p className="text-gray-500 text-sm mt-2">Empowering collaborative learning at KLH University</p>
                </div>
            </footer>
        </div>
    );
};

export default EnhancedHome;
