'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Import components
import ClipboardHeader from './components/ClipboardHeader';
import ClipboardEntryForm from './components/ClipboardEntryForm';
import ClipboardEntryList from './components/ClipboardEntryList';
import LoadingState from './components/LoadingState';
import { ClipboardEntryType } from './components/ClipboardEntry';

// Import custom hook
import { useSocketManager } from '@/lib/hooks/useSocketManager';

export default function ClipboardRoom() {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const clientId = useRef(Math.random().toString(36).substring(2, 10));
  const [copied, setCopied] = useState<string | null>(null);

  // Use our custom socket manager hook
  const {
    entries,
    connectedUsers,
    expiresIn,
    isLoading,
    error,
    addEntry: handleAddEntry,
    deleteEntry: handleDeleteEntry,
    clearClipboard: handleClearClipboard
  } = useSocketManager({
    roomCode,
    clientId: clientId.current
  });

  /* ===== Event Handlers ===== */

  const handleCopyEntry = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  // Update document title and favicon based on clipboard state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Update the document title with the number of entries
      document.title = `Clipboard (${entries.length}) - ${roomCode}`;

      // Update the favicon based on user count
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = connectedUsers > 1
          ? '/favicon-active.ico'
          : '/favicon.ico';
      }
    }
  }, [entries.length, connectedUsers, roomCode]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background text-text-primary">
      {/* Loading and Error States */}
      <LoadingState isLoading={isLoading} error={error} />

      {/* Header with Room Code and User Count - Fixed at top */}
      <ClipboardHeader
        roomCode={roomCode}
        connectedUsers={connectedUsers}
        expiresIn={expiresIn}
        onCopyLink={handleCopyLink}
      />

      {/* Scrollable content area - Only this part should scroll */}
      <div className="flex-1 overflow-y-auto">
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          {/* Add Entry Form */}
          <ClipboardEntryForm onAddEntry={handleAddEntry} />

          {/* Clipboard Entries */}
          <ClipboardEntryList
            entries={entries}
            copiedId={copied}
            onCopyEntry={handleCopyEntry}
            onDeleteEntry={handleDeleteEntry}
            onClearAll={handleClearClipboard}
          />
        </main>
      </div>
    </div>
  );
}
