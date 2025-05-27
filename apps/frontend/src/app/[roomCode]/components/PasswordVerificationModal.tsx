'use client';

import { useState, useRef, useEffect } from 'react';

interface PasswordVerificationModalProps {
  onVerify: (password: string) => Promise<boolean>;
  onCancel: () => void;
  isOpen: boolean;
}

export default function PasswordVerificationModal({
  onVerify,
  onCancel,
  isOpen
}: PasswordVerificationModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onCancel]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setIsVerifying(true);
    try {
      const success = await onVerify(password);
      if (!success) {
        setError('Incorrect password. Please try again.');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch (err) {
      setError('An error occurred while verifying the password. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-surface border border-surface-hover rounded-xl p-6 w-full max-w-md mx-4 shadow-xl animate-scaleIn relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/5 rounded-full"></div>

        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Password Protected</h2>
          </div>

          <p className="text-text-secondary mb-4">
            This clipboard is password protected. Please enter the password to access it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface/80 border-2 border-surface-hover focus:border-emerald-500 focus:outline-none focus:ring-0 transition-colors duration-300 ease-in-out text-text-primary placeholder-text-secondary/50 font-mono"
                  autoComplete="off"
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

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-4 border border-surface-hover bg-surface hover:bg-surface-hover text-text-primary font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Access Clipboard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
