'use client';

import { useState } from 'react';
import Modal from './ui/Modal';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  isLoading: boolean;
}

export default function PasswordModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = () => {
    setPasswordError('');

    if (!password.trim()) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      return;
    }

    onSubmit(password);
  };

  const handleClose = () => {
    setPassword('');
    setPasswordError('');
    onClose();
  };

  const passwordIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Set Password"
      icon={passwordIcon}
    >
      <p className="text-text-secondary mb-4 text-center">
        Create a password-protected clipboard.
      </p>

      <div className="space-y-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              placeholder="Enter password"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface/80 border-2 border-surface-hover focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-300 ease-in-out text-text-primary placeholder-text-secondary/50 font-mono"
              autoFocus
              autoComplete="off"
            />
          </div>
          {passwordError && (
            <div className="mt-2 text-error text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{passwordError}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2 px-4 border border-surface-hover bg-surface hover:bg-surface-hover text-text-primary font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
