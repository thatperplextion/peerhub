import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, PlaySquare, Upload, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700">
            <Video className="w-8 h-8" />
            <span>KLH Peer Learning</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 transition-colors ${
                location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <PlaySquare className="w-5 h-5" />
              <span>Videos</span>
            </Link>
            
            <Link 
              to="/playlists" 
              className={`flex items-center space-x-1 transition-colors ${
                location.pathname === '/playlists' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <PlaySquare className="w-5 h-5" />
              <span>Playlists</span>
            </Link>
            
            <Link 
              to="/upload" 
              className={`flex items-center space-x-1 transition-colors ${
                location.pathname === '/upload' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-1 transition-colors ${
                    location.pathname === '/profile' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
