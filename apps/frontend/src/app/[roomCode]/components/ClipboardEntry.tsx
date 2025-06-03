'use client';

import { CopyCheck, CopyCheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

export interface ClipboardEntryType {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface ClipboardEntryProps {
  entry: ClipboardEntryType;
  onCopy: (content: string, id: string) => void;
  onDelete: (id: string) => void;
  isCopied: boolean;
}

export default function ClipboardEntry({ entry, onCopy, onDelete, isCopied }: ClipboardEntryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="clipboard-entry group hover:border-primary/30 hover:shadow-glow-sm p-3 sm:p-4 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm transition-all duration-200">
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onCopy(entry.content, entry.id)}
            className="mr-auto flex items-center justify-center h-7 min-w-7 rounded-full bg-surface hover:bg-surface-hover border border-surface-hover text-text-primary hover:text-primary transition-colors"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <div className='text-primary px-2'>COPIED</div>
            ) : (
              <CopyIcon className='size-4' />
            )}
          </button>
          <div className="flex items-center text-text-secondary text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden xs:inline">{formatDate(entry.createdAt)}</span>
            <span className="xs:hidden">{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(entry.id)}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-surface hover:bg-red-500/10 border border-surface-hover text-text-primary hover:text-red-500 transition-colors"
          title="Delete entry"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

      </div>
      <div className="clipboard-entry-content overflow-x-auto whitespace-pre-wrap break-words text-sm sm:text-base">
        {entry.content}
      </div>
    </div>
  );
}
