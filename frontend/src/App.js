import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import './App.css';

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
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check if backend is running
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('Backend connected:', data);
        setBackendStatus('connected');
      })
      .catch(err => {
        console.error('Backend connection error:', err);
        setBackendStatus('disconnected');
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {backendStatus === 'checking' && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Connecting to server...</p>
            </div>
          </div>
        )}
        
        {backendStatus === 'disconnected' && (
          <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Backend Not Running</h2>
              <p className="text-gray-600 mb-4">
                Please start the backend server first:
              </p>
              <div className="bg-gray-100 p-4 rounded text-left font-mono text-sm">
                <p className="text-gray-700">cd backend</p>
                <p className="text-gray-700">npm start</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}
        
        {backendStatus === 'connected' && <Home />}
      </div>
    </QueryClientProvider>
  );
}

export default App;