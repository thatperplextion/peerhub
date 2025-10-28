import React from 'react';

const VideoCard = ({ video, viewMode }) => {
    if (!video) return null;
    
    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
            viewMode === 'list' ? 'flex' : 'flex flex-col'
        }`}>
            <div className={viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48'}>
                <img 
                    src={video.thumbnail || '/default-thumbnail.jpg'} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex-1">
                <h3 className="font-semibold text-lg mb-2">{video.title || 'Untitled Video'}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {video.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {video.subject || 'General'}
                    </span>
                    <span>{video.duration || '0:00'}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;