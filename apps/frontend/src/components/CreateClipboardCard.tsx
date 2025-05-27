'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordModal from './PasswordModal';

export default function CreateClipboardCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const router = useRouter();

  const handleCreateClipboard = async (withPassword = false) => {
    if (withPassword) {
      setShowPasswordModal(true);
      return;
    }

    await createClipboard();
  };

  const createClipboard = async (passwordToUse?: string) => {
    setIsLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/clipboard/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: passwordToUse ? JSON.stringify({ password: passwordToUse }) : undefined,
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
      setShowPasswordModal(false);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    createClipboard(password);
  };

  return (
    <>
      <div className="flex-1 p-6 md:p-8 rounded-xl border border-surface-hover bg-surface/50 backdrop-blur-sm shadow-lg hover:shadow-glow-sm transition-all duration-300 ease-out relative overflow-hidden group">
        {/* Background elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full animate-pulse-slow group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10 flex flex-col h-full gap-10 md:gap-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-text-primary">New Clipboard</h2>
          </div>

          <p className="text-text-secondary my-auto pl-1">
            Start a new shared clipboard. A unique 4-character code will be generated for you.
          </p>

          <div className="flex mt-auto w-full">
            <button
              onClick={() => handleCreateClipboard(false)}
              disabled={isLoading}
              className="flex-grow py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-l-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Clipboard
                </>
              )}
            </button>
            <button
              onClick={() => handleCreateClipboard(true)}
              disabled={isLoading}
              className="w-12 py-3 px-0 bg-primary hover:bg-primary/90 text-white font-medium rounded-r-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed border-l border-primary-dark"
              aria-label="Create password-protected clipboard"
              title="Create with password"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-error/10 border border-error/30 text-error rounded-md text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
