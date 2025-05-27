'use client';

import { useState, useRef, useEffect } from 'react';

interface ClipboardEntryFormProps {
  onAddEntry: (content: string) => void;
}

export default function ClipboardEntryForm({ onAddEntry }: ClipboardEntryFormProps) {
  const [newEntry, setNewEntry] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows, but with a maximum height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 300); // Maximum height of 300px
      textarea.style.height = `${newHeight}px`;
    }
  }, [newEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEntry.trim()) return;

    onAddEntry(newEntry);
    setNewEntry('');

    // Focus back on textarea after submit
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="mb-8 relative">
      <div className="flex items-center mb-3">
        <h2 className="text-lg font-semibold text-text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          New Entry
        </h2>
        <div className="ml-auto text-xs px-2 py-1 bg-primary/10 text-primary rounded-full flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Real-time sync
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative">
            <div className="flex focus-within:ring-2 focus-within:ring-primary/30 focus-within:rounded-lg">
              <textarea
                ref={textareaRef}
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or paste text to share..."
                className="w-full px-4 py-3 min-h-[100px] max-h-[300px] rounded-l-lg bg-surface border-r-0 border-surface-hover focus:outline-none transition-colors text-text-primary placeholder-text-secondary/50 resize-none overflow-y-auto pb-8"
              />
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.readText().then(text => {
                      if (text) {
                        setNewEntry(prev => prev + text);
                      }
                    }).catch(err => console.error('Failed to read clipboard contents: ', err));
                  }}
                  className="flex items-center justify-center h-1/2 px-3 bg-secondary hover:bg-secondary/90 text-white border border-surface-hover border-l-0 rounded-tr-lg transition-all duration-200 ease-in-out hover:shadow-glow-sm focus:outline-none"
                  title="Paste from clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={!newEntry.trim()}
                  className="flex items-center justify-center h-1/2 px-3 bg-primary hover:bg-primary/90 text-white border border-t-0 border-l-0 border-surface-hover rounded-br-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-sm focus:outline-none"
                  title="Add to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="absolute bottom-2 right-14 text-xs px-1.5 py-0.5 bg-surface-active/90 backdrop-blur-sm rounded text-text-secondary z-10">
              Ctrl+Enter to submit
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
