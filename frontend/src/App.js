import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedHome from './pages/EnhancedHome';
import VideosPage from './pages/VideosPage';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import UploadPage from './pages/UploadPage';
import VideoPlayer from './pages/VideoPlayer';
import Playlists from './pages/Playlists';
import Profile from './pages/Profile';
import './App.css';
import './enhanced.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App min-h-screen">
          <Routes>
            <Route path="/" element={<EnhancedHome />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;