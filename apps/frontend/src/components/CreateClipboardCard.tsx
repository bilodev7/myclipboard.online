'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateClipboardCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateClipboard = async () => {
    setIsLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/clipboard/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ password: 'optional_password' }), // Add if password functionality is desired
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create clipboard');
      }

      const data = await response.json();
      if (data.roomCode) {
        router.push(`/${data.roomCode}`);
      } else {
        throw new Error('Room code not received from server');
      }
    } catch (err: any) {
      console.error('Error creating clipboard:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-bg flex-1 p-6 md:p-8 rounded-xl shadow-xl hover-lift transition-all duration-300 ease-out relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full animate-pulse-slow"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">New Clipboard</h2>
        <p className="text-text-secondary mb-6">
          Start a new shared clipboard. A unique 6-character code will be generated for you.
        </p>
        <button
          onClick={handleCreateClipboard}
          disabled={isLoading}
          className="w-full btn-primary transition-all duration-200 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            'Create New Clipboard'
          )}
        </button>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-error/10 border border-error/30 text-error rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
