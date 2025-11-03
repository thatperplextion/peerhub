import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Upload, PlaySquare, BookOpen, MessageSquare, 
  User, Settings, LogOut, Bell, Search, Menu, X, GraduationCap
} from 'lucide-react';

const EnhancedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Real authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/videos', label: 'Videos', icon: PlaySquare },
    { to: '/playlists', label: 'Playlists', icon: BookOpen },
    { to: '/upload', label: 'Upload', icon: Upload },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:animate-wiggle">
              <GraduationCap className="w-6 h-6 text-blue-600 group-hover:animate-tada" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight group-hover:animate-pulse">KLH PeerHub</h1>
              <p className="text-blue-200 text-xs hidden sm:block">Learn Together, Grow Together</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActive(link.to)
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4 group-hover:animate-bounce" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300 hover:scale-110 group">
              <Search className="w-5 h-5 group-hover:animate-jiggle" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300 relative hover:scale-110 group"
              >
                <Bell className="w-5 h-5 group-hover:animate-swing" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>

            {isAuthenticated ? (
              /* User Profile */
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-white font-medium hidden lg:block">{user.name}</span>
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 animate-slide-down border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                        {user.role}
                      </span>
                    </div>
                    <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">My Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Settings</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Register */
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(link.to)
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-white/20 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-white bg-white/20 rounded-lg text-center font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 bg-white text-blue-600 rounded-lg text-center font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
