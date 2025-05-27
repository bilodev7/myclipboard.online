'use client';

import Link from 'next/link';
import CreateClipboardCard from '@/components/CreateClipboardCard';
import JoinClipboardCard from '@/components/JoinClipboardCard';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 relative">

      {/* GitHub Link */}
      <div className="absolute top-4 sm:right-4 left-1/2 sm:left-auto transform -translate-x-1/2 sm:-translate-x-0 flex space-x-3 items-center z-10">
        <a
          href="https://github.com/username/shared-clipboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm hover:bg-surface-hover transition-colors duration-200 text-text-primary shadow-md hover:shadow-glow-sm group"
        >
          <svg className="h-5 w-5 mr-2 text-primary group-hover:text-primary/90" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <span className="font-medium">GitHub</span>
          <div className="ml-2 px-2 py-0.5 bg-surface/80 rounded-md text-xs flex items-center">
            <svg className="h-3 w-3 mr-1 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
            <span>1.2k</span>
          </div>
        </a>
      </div>

      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col p-4 sm:p-6">
        {/* Main Content Container - This keeps content centered vertically */}
        <div className="flex-1 flex flex-col justify-center mt-20 sm:mt-0">
          {/* Logo and Title */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-block mb-5 relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-xl flex items-center justify-center shadow-glow overflow-hidden">

                {/* Main clipboard icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>

                {/* Sync arrows animation */}
                <div className="animate-pulse opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Shared Clipboard</h1>
            <p className="text-lg text-text-secondary">Share text snippets in real-time</p>
          </div>

          {/* Cards Container - Side by side on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10">
            <JoinClipboardCard />
            <CreateClipboardCard />
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
              <p className="text-text-secondary text-sm">Just create or join a clipboard with a 4-digit code</p>
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
      </div>

      {/* Footer */}
      <div className="text-center text-text-secondary text-xs sm:text-sm py-4 mt-auto border-t border-surface-hover">
        <p className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <span>{new Date().getFullYear()} Shared Clipboard</span>
          <span>A real-time clipboard sharing tool - Developed by Bilo</span>
        </p>
      </div>
    </div>
  );
}
