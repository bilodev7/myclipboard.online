'use client';

import { useState, useRef, useEffect } from 'react';
import { useSavedClipboards } from '../lib/hooks/useSavedClipboards';
import { createPortal } from 'react-dom';
import { History, X, Check, Edit, Clipboard, Clock, Trash2, Lock, AlertCircle } from 'lucide-react';

interface SavedClipboardsButtonProps {
  onSelectClipboard: (roomCode: string) => void;
}

export default function SavedClipboardsButton({ onSelectClipboard }: SavedClipboardsButtonProps) {
  const { savedClipboards, removeClipboard, renameClipboard, clearClipboards } = useSavedClipboards();
  const [isOpen, setIsOpen] = useState(false);
  const [editingRoomCode, setEditingRoomCode] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if there are saved clipboards
  const hasSavedClipboards = savedClipboards.length > 0;

  // Handle client-side rendering for the portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (editingRoomCode !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingRoomCode]);

  // Handle ESC key to close the panel
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setEditingRoomCode(null);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const handleRename = (roomCode: string) => {
    if (editingRoomCode === roomCode) {
      // Save the new name
      renameClipboard(roomCode, newName);
      setEditingRoomCode(null);
    } else {
      // Start editing
      const clipboard = savedClipboards.find(item => item.roomCode === roomCode);
      setNewName(clipboard?.name || '');
      setEditingRoomCode(roomCode);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // If it's today, show only the time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // If it's yesterday, show "Yesterday"
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Otherwise show the date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={!hasSavedClipboards}
        className={`p-3 rounded-lg border transition-all duration-200 shadow-md h-full flex items-center justify-center
          ${hasSavedClipboards
            ? 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/30'
            : 'bg-surface/80 text-text-secondary/50 border-surface-hover cursor-not-allowed'
          }
        `}
        title={hasSavedClipboards ? "Show saved clipboards" : "No saved clipboards"}
      >
        <History className="h-5 w-5" />
      </button>

      {/* Slide-in panel for saved clipboards */}
      {isMounted && isOpen && hasSavedClipboards && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/30 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="bg-surface border-l border-surface-hover w-full max-w-sm h-full overflow-y-auto transition-transform duration-300 ease-out transform relative"
            style={{ boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-surface-hover p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary flex items-center">
                <History className="h-5 w-5 mr-2 text-primary" />
                Clipboards History
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Clipboard list */}
            <div className="divide-y divide-surface-hover">
              {savedClipboards.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">
                  <Clipboard className="h-12 w-12 mx-auto mb-3 text-text-secondary/50" />
                  <p>Empty</p>
                </div>
              ) : (
                savedClipboards.map((clipboard, index) => (
                  <div
                    key={clipboard.roomCode}
                    className={`relative border-b border-surface-hover last:border-b-0 ${clipboard.isExpired ? 'opacity-70' : ''} ${editingRoomCode === clipboard.roomCode ? 'bg-surface/80' : 'hover:bg-surface/80'}`}
                  >
                    {/* Hover indicator */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 transition-transform duration-200 ${editingRoomCode === clipboard.roomCode ? 'scale-y-100' : 'group-hover:scale-y-100'}`}
                    />

                    <div className="p-4 group">
                      <div className="flex justify-between items-start">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            onSelectClipboard(clipboard.roomCode);
                            setIsOpen(false);
                          }}
                        >
                          {editingRoomCode === clipboard.roomCode ? (
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-text-secondary mb-1">Clipboard Name</label>
                              <input
                                ref={inputRef}
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRename(clipboard.roomCode);
                                  } else if (e.key === 'Escape') {
                                    setEditingRoomCode(null);
                                  }
                                }}
                                className="w-full px-3 py-2 rounded bg-background border border-surface-hover text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
                                placeholder="Enter a name..."
                                onClick={(e) => e.stopPropagation()}
                                autoComplete="off"
                              />
                            </div>
                          ) : (
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3 mt-1">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <Clipboard className="h-4 w-4" />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-text-primary flex items-center flex-wrap">
                                  {clipboard.name ? (
                                    <span className="text-secondary mr-2">{clipboard.name}</span>
                                  ) : null}
                                  <span className="font-mono text-sm text-text-secondary">{clipboard.roomCode}</span>
                                  {clipboard.isPasswordProtected && (
                                    <span className="ml-2 text-amber-500" title="Password protected">
                                      <Lock className="h-3 w-3" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs mt-1 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className={clipboard.isExpired ? "text-error" : "text-text-secondary"}>
                                    {formatDate(clipboard.lastVisited)}
                                    {clipboard.isExpired && (
                                      <span className="ml-2 inline-flex items-center text-error">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Expired
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-1 ml-2 my-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRename(clipboard.roomCode);
                            }}
                            title={editingRoomCode === clipboard.roomCode ? "Save" : "Rename"}
                            className="p-1.5 rounded-full hover:bg-surface-hover text-text-secondary hover:text-secondary transition-colors"
                          >
                            {editingRoomCode === clipboard.roomCode ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeClipboard(clipboard.roomCode);
                            }}
                            title="Remove"
                            className="p-1.5 rounded-full hover:bg-surface-hover text-text-secondary hover:text-error transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with clear button */}
            {savedClipboards.length > 0 && (
              <div className="sticky bottom-0 bg-surface border-t border-surface-hover p-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all saved clipboards?')) {
                      clearClipboards();
                      setIsOpen(false);
                    }
                  }}
                  className="px-3 py-1.5 text-xs text-text-secondary hover:text-error transition-colors rounded hover:bg-surface/80 flex items-center"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
