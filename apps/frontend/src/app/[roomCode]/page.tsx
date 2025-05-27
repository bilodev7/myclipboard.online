'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Import components
import ClipboardHeader from './components/ClipboardHeader';
import ClipboardEntryForm from './components/ClipboardEntryForm';
import ClipboardEntryList from './components/ClipboardEntryList';
import LoadingState from './components/LoadingState';
import PasswordVerificationModal from './components/PasswordVerificationModal';
import { ClipboardEntryType } from './components/ClipboardEntry';

// Import custom hooks
import { useSocketManager } from '@/lib/hooks/useSocketManager';
import { useSavedClipboards } from '@/lib/hooks/useSavedClipboards';

export default function ClipboardRoom() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const clientId = useRef(Math.random().toString(36).substring(2, 10));
  const [copied, setCopied] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(true);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  
  // Use saved clipboards hook to track clipboard history
  const { addClipboard } = useSavedClipboards();

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

  // Check for password protection when component mounts
  useEffect(() => {
    checkPasswordProtection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

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

  // Check if the clipboard is password protected
  const checkPasswordProtection = async () => {
    try {
      setIsCheckingPassword(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/clipboard/${roomCode}/exists`);

      if (!response.ok) {
        throw new Error('Failed to check clipboard');
      }

      const data = await response.json();

      if (!data.exists) {
        // Clipboard doesn't exist
        router.push('/');
        return;
      }

      // Check if clipboard has a password
      if (data.hasPassword) {
        setIsPasswordProtected(true);
        setShowPasswordModal(true);
      } else {
        // No password, proceed directly
        setIsPasswordVerified(true);
        
        // Save to clipboard history since we've successfully accessed it
        addClipboard(roomCode);
      }
    } catch (err) {
      console.error('Error checking clipboard:', err);
    } finally {
      setIsCheckingPassword(false);
    }
  };

  // Verify clipboard password
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/clipboard/${roomCode}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsPasswordVerified(true);
        setShowPasswordModal(false);
        
        // Save to clipboard history after successful password verification
        addClipboard(roomCode);
        
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error verifying password:', err);
      return false;
    }
  };

  // Handle cancel password verification
  const handleCancelPasswordVerification = () => {
    router.push('/');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background text-text-primary">
      {/* Loading and Error States */}
      <LoadingState isLoading={isLoading || isCheckingPassword} error={error} />

      {/* Password Verification Modal */}
      <PasswordVerificationModal
        onVerify={verifyPassword}
        onCancel={handleCancelPasswordVerification}
        isOpen={isPasswordProtected && showPasswordModal && !isPasswordVerified}
      />

      {/* Only show content if not password protected or password has been verified */}
      {(!isPasswordProtected || isPasswordVerified) && (
        <>
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
        </>
      )}
    </div>
  );
}
