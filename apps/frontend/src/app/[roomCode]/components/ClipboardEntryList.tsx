'use client';

import ClipboardEntry, { ClipboardEntryType } from './ClipboardEntry';

interface ClipboardEntryListProps {
  entries: ClipboardEntryType[];
  copiedId: string | null;
  onCopyEntry: (content: string, id: string) => void;
  onDeleteEntry: (id: string) => void;
}

export default function ClipboardEntryList({ 
  entries, 
  copiedId, 
  onCopyEntry, 
  onDeleteEntry 
}: ClipboardEntryListProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10">
        <h2 className="text-lg font-semibold text-text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Clipboard Entries
        </h2>
        <span className="text-text-secondary text-sm px-2 py-1 bg-surface-hover rounded-full">
          {entries.length} {entries.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <div className="space-y-4">
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
