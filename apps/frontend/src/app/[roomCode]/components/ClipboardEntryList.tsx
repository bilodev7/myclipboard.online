'use client';

import { useState } from 'react';
import ClipboardEntry, { ClipboardEntryType } from './ClipboardEntry';

interface ClipboardEntryListProps {
  entries: ClipboardEntryType[];
  onCopyEntry: (content: string, id: string) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  copiedId: string | null;
}

export default function ClipboardEntryList({ 
  entries, 
  copiedId, 
  onCopyEntry, 
  onDeleteEntry, 
  onClearAll 
}: ClipboardEntryListProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearRequest = () => {
    if (showClearConfirm) {
      onClearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-background/90 backdrop-blur-sm py-2 z-10">
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button
              onClick={handleClearRequest}
              className={`flex items-center px-1.5 py-1 rounded-lg transition-all duration-200 text-xs ${showClearConfirm ? 'bg-red-500/90 text-white' : 'bg-surface hover:bg-surface-hover text-text-secondary hover:text-red-500'} border border-surface-hover`}
              title="Clear all clipboard entries"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {showClearConfirm ? 'Confirm' : 'Clear'}
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4 px-1">
        {entries.length === 0 ? (
          <div className="clipboard-entry border-dashed flex flex-col items-center justify-center py-12 mt-4">
            <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-text-secondary mb-2">No entries yet</p>
            <p className="text-text-secondary/70 text-sm">Add your first entry using the form above</p>
          </div>
        ) : (
          entries.map((entry) => (
            <ClipboardEntry
              key={entry.id}
              entry={entry}
              onCopy={onCopyEntry}
              onDelete={onDeleteEntry}
              isCopied={copiedId === entry.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
