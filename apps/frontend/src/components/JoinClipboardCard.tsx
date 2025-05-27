'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinClipboardCard() {
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

  return (
    <div className="flex-1 p-6 md:p-8 rounded-xl border border-surface-hover bg-surface/50 backdrop-blur-sm shadow-lg hover:shadow-secondary/20 hover:border-secondary/50 transition-all duration-300 ease-out relative overflow-hidden group">
      {/* Background elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full animate-pulse-slow group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-secondary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-text-primary">Join Clipboard</h2>
        </div>
        
        <p className="text-text-secondary mb-6 pl-1">
          Enter a 6-character code to join an existing clipboard.
        </p>
        
        <form onSubmit={handleJoinClipboard} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  if (error) setError('');
                }}
                placeholder="Enter 6-character code"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface/80 border-2 border-surface-hover focus:border-secondary focus:outline-none focus:ring-0 transition-colors duration-300 ease-in-out text-text-primary placeholder-text-secondary/50 font-mono tracking-wider shadow-inner"
                maxLength={6}
                autoComplete="off"
                aria-label="Room code"
              />
            </div>
            {error && (
              <div className="mt-2 text-error text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Join Clipboard
          </button>
        </form>
      </div>
    </div>
  );
}
