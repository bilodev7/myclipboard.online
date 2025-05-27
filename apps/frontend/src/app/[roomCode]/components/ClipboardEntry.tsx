'use client';

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
    <div className="clipboard-entry group hover:border-primary/30 hover:shadow-glow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-text-secondary text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(entry.createdAt)}
        </div>
        <div className="flex space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(entry.content, entry.id)}
            className="icon-btn text-text-primary hover:text-primary"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="icon-btn text-text-primary hover:text-error"
            title="Delete entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="clipboard-entry-content">
        {entry.content}
      </div>
    </div>
  );
}
