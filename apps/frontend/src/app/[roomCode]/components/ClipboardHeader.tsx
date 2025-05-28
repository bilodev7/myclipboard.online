'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardIcon } from 'lucide-react';
import Logo from '@/components/Logo';

interface ClipboardHeaderProps {
  roomCode: string;
  connectedUsers: number;
  expiresIn: string | null;
  onCopyLink: () => void;
}

export default function ClipboardHeader({
  roomCode,
  connectedUsers,
  expiresIn,
  onCopyLink
}: ClipboardHeaderProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    onCopyLink();
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-surface-hover py-2 sm:py-3 md:py-4 sticky top-0 z-20">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 sm:gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/">
              <button className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface hover:bg-surface-hover border border-surface-hover transition-all duration-200 shadow-sm hover:shadow-md" title="Back to home">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center">
              <button
                onClick={handleCopyLink}
                className={`text-primary font-mono px-2 py-2 rounded flex items-center ${linkCopied ? 'bg-primary/20' : 'hover:bg-primary/10'} transition-colors duration-200`}
                title="Click to copy room link"
              >
                <span className="leading-none -mb-1">{roomCode.substring(0, 2)}-{roomCode.substring(2)}</span>
                {linkCopied && (
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded inline-flex items-center">Copied!</span>
                )}
              </button>
            </h1>
          </div>

          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{connectedUsers} <span className="hidden sm:inline">{connectedUsers === 1 ? 'user' : 'users'}</span></span>
            </div>

            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="hidden sm:inline">End-to-End Encrypted</span>
              <span className="sm:hidden">E2E</span>
            </div>

            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {expiresIn ? (
                <span>Expires in {expiresIn}</span>
              ) : (
                <>
                  <span className="hidden sm:inline">Active for 24 hours</span>
                  <span className="sm:hidden">24h</span>
                </>
              )}
            </div>

            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Real-time sync</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
