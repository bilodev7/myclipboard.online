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
    <div className="card-bg flex-1 p-6 md:p-8 rounded-xl shadow-xl hover-lift transition-all duration-300 ease-out relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full animate-pulse-slow"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Join Clipboard</h2>
        <p className="text-text-secondary mb-6">
          Enter a 6-character code to join an existing clipboard.
        </p>
        <form onSubmit={handleJoinClipboard} className="space-y-4">
          <div>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase());
                if (error) setError('');
              }}
              placeholder="Enter 6-character code"
              className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-hover focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors text-text-primary placeholder-text-secondary/50"
              maxLength={6}
              autoComplete="off"
            />
            {error && <p className="mt-2 text-error text-sm">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full btn-secondary transition-all duration-200 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-secondary/30"
          >
            Join Clipboard
          </button>
        </form>
      </div>
    </div>
  );
}
