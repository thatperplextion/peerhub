import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Grid, List } from 'lucide-react';
import VideoCard from '../components/Video/VideoCard';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const { data: videos = [], isLoading } = useQuery({
        queryKey: ['videos', searchTerm, subjectFilter],
        queryFn: async () => {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (subjectFilter) params.subject = subjectFilter;

            try {
                const response = await axios.get('http://localhost:5000/api/videos', { params });
                return response.data.videos || [];
            } catch (error) {
                console.error('Error fetching videos:', error);
                return [];
            }
        }
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Video Learning Platform</h1>
                <p className="text-gray-600">Discover and learn from educational videos</p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                        />
                    </div>
                    
                    {/* Subject Filter */}
                    <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Subjects</option>
                        <option value="math">Mathematics</option>
                        <option value="science">Science</option>
                        <option value="history">History</option>
                        <option value="english">English</option>
                        <option value="programming">Programming</option>
                    </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${
                            viewMode === 'grid' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${
                            viewMode === 'list' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Videos Section */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className={
                    viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                        : "flex flex-col gap-4"
                }>
                    {videos.map((video, index) => (
                        <VideoCard 
                            key={video.id || index} 
                            video={video} 
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && videos.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No videos found</p>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Home;