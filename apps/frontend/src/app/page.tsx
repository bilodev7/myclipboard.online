'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Validate room code format (6 alphanumeric characters, uppercase)
  const isValidRoomCode = (code: string): boolean => {
    const roomCodeRegex = /^[A-Z0-9]{6}$/;
    return roomCodeRegex.test(code);
  };

  const handleJoinClipboard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    
    // Validate room code format
    if (!isValidRoomCode(roomCode)) {
      setError('Invalid room code format. Code should be 6 characters (letters and numbers)');
      return;
    }
    
    // Navigate to the clipboard room
    router.push(`/${roomCode}`);
  };

  const handleCreateClipboard = async () => {
    // Generate a random code for the new clipboard
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Pass isCreating=true as a query parameter to indicate this is a new clipboard
    router.push(`/${newRoomCode}?isCreating=true`);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
        {/* Main Content Container - This keeps content centered vertically */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Logo and Title */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 relative">
            <div className="w-16 h-16 bg-gradient-mesh rounded-xl flex items-center justify-center shadow-glow overflow-hidden">
              {/* Main clipboard icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              
              {/* Sync arrows animation */}
              <div className="animate-pulse opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Shared Clipboard</h1>
          <p className="text-text-secondary">Share text snippets in real-time</p>
          </div>
          
          {/* Cards Container - Side by side on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            {/* Security Badge and GitHub Link - Top right */}
            <div className="absolute top-4 right-4 flex space-x-3 items-center">
            <a 
              href="https://github.com/username/shared-clipboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active transition-colors duration-200 text-text-primary shadow-md hover:shadow-lg"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span className="font-medium">GitHub</span>
              <div className="ml-2 px-1.5 py-0.5 bg-surface rounded-md text-xs flex items-center">
                <svg className="h-3 w-3 mr-1 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                </svg>
                <span className="font-medium">1.2k</span>
              </div>
            </a>
            
            <div className="bg-emerald-500/10 text-emerald-500 text-xs font-medium py-1 px-2 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              End-to-End Encrypted
            </div>
          </div>
            {/* Create New Clipboard Card */}
            <div className="card card-hover group flex-1">
              <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-text-primary group-hover:text-text-accent transition-colors">Create New</h2>
              <span className="text-accent bg-accent/10 p-1 rounded text-xs font-medium">Instant</span>
            </div>
            <p className="text-text-secondary mb-6">
              Create a new shared clipboard and share the code with others. No account required.
            </p>
            <div className="mt-auto">
              <button 
                onClick={handleCreateClipboard}
                className="btn btn-primary w-full group-hover:shadow-glow-sm transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Clipboard
              </button>
            </div>
          </div>
          
            {/* Join Existing Clipboard Card */}
            <div className="card card-hover flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-text-primary">Join Existing</h2>
              <span className="text-secondary bg-secondary/10 p-1 rounded text-xs font-medium">6-Digit Code</span>
            </div>
            <form onSubmit={handleJoinClipboard} className="h-full flex flex-col">
              <div className="mb-6 flex-grow">
                <label htmlFor="roomCode" className="block text-sm font-medium text-text-secondary mb-2">
                  Room Code
                </label>
                <input
                  id="roomCode"
                  type="text"
                  placeholder="Enter 6-digit code (e.g., ABC123)"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  className="input w-full text-lg tracking-wider text-center uppercase"
                  maxLength={6}
                />
                {error && (
                  <div className="mt-2 flex items-center text-sm text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                )}
              </div>
              <button 
                type="submit"
                className="btn btn-secondary w-full mt-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Join Clipboard
              </button>
            </form>
          </div>
        </div>
        
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="p-4 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">Real-time Sync</h3>
            <p className="text-text-secondary text-sm">Changes appear instantly across all connected devices</p>
          </div>
          
          <div className="p-4 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">No Login Required</h3>
            <p className="text-text-secondary text-sm">Just create or join a clipboard with a 6-digit code</p>
          </div>
          
          <div className="p-4 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">24-Hour Storage</h3>
            <p className="text-text-secondary text-sm">Clipboards automatically expire after 24 hours of inactivity</p>
          </div>
          
          <div className="p-4 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-12 h-12 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1 relative z-10">End-to-End Encrypted</h3>
            <p className="text-text-secondary text-sm relative z-10">Your clipboard data is fully encrypted and secure</p>
            <div className="absolute bottom-1 right-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
        
        </div>
        {/* Footer */}
        <div className="text-center text-text-secondary text-sm py-4 mt-auto border-t border-surface-hover">
          <p>© {new Date().getFullYear()} Shared Clipboard - A real-time clipboard sharing tool</p>
        </div>
      </div>
    </div>
  );
}
