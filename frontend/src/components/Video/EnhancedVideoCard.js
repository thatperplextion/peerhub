import React, { useState } from 'react';
import { Play, Clock, Eye, ThumbsUp, User, BookOpen, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const EnhancedVideoCard = ({ video, viewMode = 'grid' }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatViews = (views) => {
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views || 0;
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    };

    if (viewMode === 'list') {
        return (
            <Link to={`/video/${video._id}`}>
                <div 
                    className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-4 flex gap-4 transform hover:scale-[1.02] border border-gray-100"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-64 h-36 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Play className={`w-16 h-16 text-white transition-transform duration-300 ${
                                isHovered ? 'scale-125' : 'scale-100'
                            }`} />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                            {formatDuration(video.duration || 0)}
                        </div>
                        {video.processingStatus === 'processing' && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                                Processing...
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors">
                            {video.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {video.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {video.subject}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                {video.topic}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{formatViews(video.views)} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{video.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{getTimeAgo(video.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Grid view
    return (
        <Link to={`/video/${video._id}`}>
            <div 
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 border border-gray-100 hover:animate-float"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-500 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
                        <div className={`bg-white/90 rounded-full p-4 shadow-2xl transition-transform duration-300 ${
                            isHovered ? 'scale-125 rotate-12 animate-heartbeat' : 'scale-100 rotate-0'
                        }`}>
                            <Play className="w-10 h-10 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-lg">
                        {formatDuration(video.duration || 0)}
                    </div>

                    {/* Status Badge */}
                    {video.processingStatus === 'processing' && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold animate-pulse">
                            Processing...
                        </div>
                    )}

                    {/* Trending Badge */}
                    {video.views > 100 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1 animate-bounce">
                            <TrendingUp className="w-3 h-3 animate-pulse" />
                            Trending
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
                        {video.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                        {video.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {video.subject}
                        </span>
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            {video.topic}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 hover:text-blue-600 transition-colors group">
                                <Eye className="w-4 h-4 group-hover:animate-wiggle" />
                                <span className="font-medium">{formatViews(video.views)}</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-red-600 transition-colors group">
                                <ThumbsUp className="w-4 h-4 group-hover:animate-heartbeat" />
                                <span className="font-medium">{video.likes?.length || 0}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs group">
                            <Clock className="w-3 h-3 group-hover:animate-spin-slow" />
                            <span>{getTimeAgo(video.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EnhancedVideoCard;
