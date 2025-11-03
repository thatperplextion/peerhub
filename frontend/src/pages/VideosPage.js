import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Eye, ThumbsUp, Play, User, Calendar, Tag, TrendingUp, BookOpen, Download, Share2, Bookmark, Grid3x3, List, BarChart3 } from 'lucide-react';
import EnhancedNavbar from '../components/Layout/EnhancedNavbar';

const VideosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [viewMode, setViewMode] = useState('list');
    const [filterYear, setFilterYear] = useState('');
    const [filterSemester, setFilterSemester] = useState('');

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
                return response.data.videos || response.data || [];
            } catch (error) {
                console.error('Error fetching videos:', error);
                return [];
            }
        }
    });

    const subjects = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering'];

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <EnhancedNavbar />
            
            <div className="container mx-auto px-4 py-6">
                {/* Compact Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
                        All Videos
                    </h1>
                    <p className="text-gray-600">Browse through our entire video library</p>
                </div>

                {/* Compact Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search videos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Subject Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={subjectFilter}
                                onChange={(e) => setSubjectFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="relative">
                            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="popular">Most Popular</option>
                                <option value="views">Most Viewed</option>
                                <option value="likes">Most Liked</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Additional Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Year Filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">All Years</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>

                        {/* Semester Filter */}
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={filterSemester}
                                onChange={(e) => setFilterSemester(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">All Semesters</option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <List className="w-4 h-4" />
                                <span className="hidden sm:inline">List</span>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Grid</span>
                            </button>
                        </div>

                        {/* Stats Button */}
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
                            <BarChart3 className="w-4 h-4" />
                            <span className="hidden sm:inline">View Stats</span>
                        </button>
                    </div>
                </div>

                {/* Videos List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading videos...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Videos</h3>
                        <p className="text-red-600">Please try again later.</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📹</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No videos found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                        {videos.map((video, index) => (
                            viewMode === 'list' ? (
                            <div
                                key={video._id}
                                className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Thumbnail */}
                                    <Link to={`/video/${video._id}`} className="relative md:w-80 h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex-shrink-0">
                                        {video.thumbnail ? (
                                            <img
                                                src={`http://localhost:5000${video.thumbnail}`}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Play className="w-20 h-20 text-white opacity-80" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                            <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                                        </div>
                                        {video.duration && (
                                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                {formatDuration(video.duration)}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Video Info */}
                                    <div className="flex-1 p-4">
                                        <Link to={`/video/${video._id}`}>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {video.title}
                                            </h3>
                                        </Link>
                                        
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {video.description}
                                        </p>

                                        {/* Stats Row */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span>{video.uploader?.name || 'Anonymous'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(video.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{video.views || 0} views</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{video.likes?.length || 0} likes</span>
                                            </div>
                                        </div>

                                        {/* Tags and Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {video.subject && (
                                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                                                        <Tag className="w-3 h-3" />
                                                        {video.subject}
                                                    </span>
                                                )}
                                                {video.topic && (
                                                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                                                        {video.topic}
                                                    </span>
                                                )}
                                                {video.courseCode && (
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                                                        {video.courseCode}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all group/btn">
                                                    <Bookmark className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all group/btn">
                                                    <Share2 className="w-4 h-4 text-gray-400 group-hover/btn:text-green-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all group/btn">
                                                    <Download className="w-4 h-4 text-gray-400 group-hover/btn:text-purple-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ) : (
                                // Grid View
                                <Link
                                    key={video._id}
                                    to={`/video/${video._id}`}
                                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                                        {video.thumbnail ? (
                                            <img
                                                src={`http://localhost:5000${video.thumbnail}`}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Play className="w-16 h-16 text-white opacity-80" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                                        </div>
                                        {video.duration && (
                                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                {formatDuration(video.duration)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {video.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{video.views || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{video.likes?.length || 0}</span>
                                            </div>
                                            <span>{formatDate(video.createdAt)}</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {videos.length > 0 && (
                    <div className="mt-6 text-center text-gray-600">
                        Showing {videos.length} video{videos.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideosPage;
