'use client';

import Link from 'next/link';
import CreateClipboardCard from '@/components/CreateClipboardCard';
import JoinClipboardCard from '@/components/JoinClipboardCard';
import FeaturesSection from '@/components/FeaturesSection';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 relative">

      {/* GitHub Link */}
      <div className="absolute top-4 sm:right-4 left-1/2 sm:left-auto transform -translate-x-1/2 sm:-translate-x-0 flex space-x-3 items-center z-10">
        <a
          href="https://github.com/bilodev7/myclipboard.online"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm hover:bg-surface-hover transition-colors duration-200 text-text-primary shadow-md hover:shadow-glow-sm group"
        >
          <svg className="h-5 w-5 mr-2 text-primary group-hover:text-primary/90" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <span className="font-medium">GitHub</span>
          {/* <div className="ml-2 px-2 py-0.5 bg-surface/80 rounded-md text-xs flex items-center">
            <svg className="h-3 w-3 mr-1 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
            <span>1.2k</span>
          </div> */}
        </a>
      </div>

      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col p-6 sm:p-8 sm:py-14">
        {/* Main Content Container - This keeps content centered vertically */}
        <div className="flex-1 flex flex-col justify-center mt-20 sm:mt-0">
          {/* Logo and Title */}
          <div className="mb-10 sm:mb-12 flex flex-col items-center">
            <div className="flex items-center gap-3">
              {/* <div className='overflow-hidden rounded-lg'>
                <Logo />
              </div> */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Clipboard Online
              </h1>
            </div>
            <p className="text-lg text-center text-text-secondary mt-2">
              Real-time clipboard sharing for text and files
            </p>
          </div>

          {/* Cards Container - Side by side on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10">
            <JoinClipboardCard />
            <CreateClipboardCard />
          </div>

          {/* Features */}
          <FeaturesSection />

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-text-secondary text-xs sm:text-sm py-4 mt-auto border-t border-surface-hover">
        <p className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <span>{new Date().getFullYear()} Clipboard Online</span>
          <span>A real-time clipboard sharing tool - Developed by Bilo</span>
        </p>
      </div>
    </div>
  );
}
