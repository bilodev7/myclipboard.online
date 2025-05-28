'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, FileIcon } from 'lucide-react';

// Import components
import ClipboardHeader from './components/ClipboardHeader';
import ClipboardEntryForm from './components/ClipboardEntryForm';
import ClipboardEntryList from './components/ClipboardEntryList';
import LoadingState from './components/LoadingState';
import PasswordVerificationModal from './components/PasswordVerificationModal';
import { ClipboardEntryType } from './components/ClipboardEntry';
import FileUploadComponent from './components/FileUploadComponent';
import FileList from './components/FileList';
import { FileEntryType } from './components/FileEntry';

// Import custom hooks
import { useSocketManager } from '@/lib/hooks/useSocketManager';
import { useSavedClipboards } from '@/lib/hooks/useSavedClipboards';
import { apiUrl } from '@/lib/constants';

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
  const [activeTab, setActiveTab] = useState<'entries' | 'files'>('entries');

  // Use saved clipboards hook to track clipboard history
  const { addClipboard } = useSavedClipboards();

  // Use our custom socket manager hook
  const {
    entries,
    files,
    connectedUsers,
    expiresIn,
    isLoading,
    error,
    socketRef,
    addEntry: handleAddEntry,
    deleteEntry: handleDeleteEntry,
    clearClipboard: handleClearClipboard,
    deleteFile: handleDeleteFile
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

  // Handle file uploaded event
  const handleFileUploaded = (fileEntry: FileEntryType) => {
    // Emit socket event to notify other clients
    if (socketRef) {
      socketRef.current?.emit('fileUploaded', {
        roomCode,
        fileEntry,
        clientId: clientId.current,
      });
    }
    
    // Switch to files tab after upload to show the newly uploaded file
    setActiveTab('files');
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
              {/* Unified Input Section */}
              <div className="mb-6">
                {activeTab === 'entries' ? (
                  <ClipboardEntryForm onAddEntry={handleAddEntry} />
                ) : (
                  <FileUploadComponent
                    roomCode={roomCode}
                    clientId={clientId.current}
                    onFileUploaded={handleFileUploaded}
                  />
                )}
              </div>
              
              {/* Tabs Navigation */}
              <div className="flex border-b border-surface-hover mb-4">
                <button
                  onClick={() => setActiveTab('entries')}
                  className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === 'entries'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-surface-hover'
                  } transition-colors`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Text Entries
                  {entries.length > 0 && (
                    <span className="ml-2 bg-surface-hover text-text-secondary text-xs px-2 py-0.5 rounded-full">
                      {entries.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('files')}
                  className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === 'files'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-surface-hover'
                  } transition-colors`}
                >
                  <FileIcon className="w-4 h-4 mr-2" />
                  Files
                  {files.length > 0 && (
                    <span className="ml-2 bg-surface-hover text-text-secondary text-xs px-2 py-0.5 rounded-full">
                      {files.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === 'entries' ? (
                  <ClipboardEntryList
                    entries={entries}
                    copiedId={copied}
                    onCopyEntry={handleCopyEntry}
                    onDeleteEntry={handleDeleteEntry}
                    onClearAll={handleClearClipboard}
                  />
                ) : (
                  <FileList
                    files={files}
                    onDeleteFile={handleDeleteFile}
                    roomCode={roomCode}
                  />
                )}
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
