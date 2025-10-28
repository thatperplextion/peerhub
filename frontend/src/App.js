import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedHome from './pages/EnhancedHome';
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
            <Route path="/videos" element={<EnhancedHome />} />
            <Route path="/playlists" element={<div className="p-8 text-center">Playlists page coming soon!</div>} />
            <Route path="/upload" element={<div className="p-8 text-center">Upload page coming soon!</div>} />
            <Route path="/login" element={<div className="p-8 text-center">Login page coming soon!</div>} />
            <Route path="/register" element={<div className="p-8 text-center">Register page coming soon!</div>} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;