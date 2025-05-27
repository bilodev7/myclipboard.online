'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ClipboardHeaderProps {
  roomCode: string;
  connectedUsers: number;
  expiresIn: string | null;
  onCopyLink: () => void;
  onClearClipboard: () => void;
}

export default function ClipboardHeader({
  roomCode,
  connectedUsers,
  expiresIn,
  onCopyLink,
  onClearClipboard
}: ClipboardHeaderProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    onCopyLink();
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleClearRequest = () => {
    if (showClearConfirm) {
      onClearClipboard();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  return (
    <div className="bg-background/90 backdrop-blur-sm z-10 border-b border-surface-hover">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-surface-hover transition-all duration-200 shadow-sm hover:shadow-md" title="Back to home">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary flex items-center">
              <span className="mr-2">Clipboard</span>
              <span className="text-primary bg-primary/10 px-2 py-0.5 rounded font-mono text-sm">
                {roomCode}
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mt-1">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{connectedUsers} {connectedUsers === 1 ? 'user' : 'users'} connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Expires in: {expiresIn || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-medium">End-to-End Encrypted</span>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className={`flex items-center px-3 py-1.5 rounded-lg ${linkCopied ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-hover'} border border-surface-hover transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span className="text-sm font-medium">{linkCopied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button
            onClick={handleClearRequest}
            className={`flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${showClearConfirm ? 'bg-red-500/90 text-white' : 'bg-surface hover:bg-surface-hover'} border border-surface-hover`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-sm font-medium">{showClearConfirm ? 'Confirm Clear' : 'Clear All'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
