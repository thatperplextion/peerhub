import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Eye, ThumbsUp, MessageSquare, Award, Settings, Bell, Shield, BookMarked, Edit, Save, X, Camera, Mail, User } from 'lucide-react';
import DarkNavbar from '../components/Layout/DarkNavbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300">
        <DarkNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <DarkNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
