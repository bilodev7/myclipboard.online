'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import io, { Socket } from 'socket.io-client';

type ClipboardEntry = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
};

export default function ClipboardRoom() {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [expiresIn, setExpiresIn] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const params = useParams();
  const roomCode = params.roomCode as string;
  const clientId = useRef(Math.random().toString(36).substring(2, 10));
  const router = useRouter();
  
  // Validate room code format (6 alphanumeric characters, uppercase)
  const isValidRoomCode = (code: string): boolean => {
    const roomCodeRegex = /^[A-Z0-9]{6}$/;
    return roomCodeRegex.test(code);
  };

  useEffect(() => {
    // Validate room code format before connecting
    if (!isValidRoomCode(roomCode)) {
      setError(`Invalid clipboard code format: ${roomCode}`);
      setIsLoading(false);
      return;
    }

    // In a production app, this would be an environment variable
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    // Check if we're creating a new clipboard from the URL query parameter
    const isCreating = new URLSearchParams(window.location.search).get('isCreating') === 'true';
    
    // Connect to the Socket.io server with explicit transport options
    socketRef.current = io(SOCKET_URL, {
      query: { roomCode, isCreating: isCreating ? 'true' : 'false' },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
    });

    // Handle connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Join the room after successful connection
      socketRef.current?.emit('joinRoom', { roomCode, clientId: clientId.current });
    });
    
    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to the server. Please try again later.');
      setIsLoading(false);
    });
    
    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        setError('Disconnected from server. The clipboard may not exist.');
        setIsLoading(false);
      }
    });
    
    // Handle clipboard not found error
    socketRef.current.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message);
      setError(data.message);
      setIsLoading(false);
      
      // If clipboard not found and not creating, redirect back to home after a delay
      if (data.message === 'Clipboard not found' && !isCreating) {
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    });

    // Listen for initial clipboard data
    socketRef.current.on('clipboardData', (data: { entries: ClipboardEntry[], connectedUsers: number, expiresIn?: string }) => {
      setEntries(data.entries);
      setConnectedUsers(data.connectedUsers);
      if (data.expiresIn) {
        setExpiresIn(data.expiresIn);
      }
    });

    // Listen for new entries
    socketRef.current.on('newEntry', (entry: ClipboardEntry) => {
      setEntries(prev => [entry, ...prev]);
    });

    // Listen for deleted entries
    socketRef.current.on('deleteEntry', (entryId: string) => {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    });

    // Listen for user count updates
    socketRef.current.on('userCount', (count: number) => {
      setConnectedUsers(count);
    });

    // Listen for expiration updates
    socketRef.current.on('expirationUpdate', (time: string) => {
      setExpiresIn(time);
    });

    return () => {
      // Disconnect socket when component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomCode]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.trim()) return;
    
    if (socketRef.current) {
      socketRef.current.emit('addEntry', {
        roomCode,
        content: newEntry,
        clientId: clientId.current,
      });
      
      setNewEntry('');
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('deleteEntry', {
        roomCode,
        entryId,
        clientId: clientId.current,
      });
    }
  };

  const handleCopyEntry = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${roomCode}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleClearClipboard = () => {
    if (socketRef.current) {
      socketRef.current.emit('clearClipboard', {
        roomCode,
        clientId: clientId.current,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Update loading state when clipboard data is received
  useEffect(() => {
    if (entries.length > 0 || connectedUsers > 1) {
      setIsLoading(false);
    }
  }, [entries, connectedUsers]);

  // If there's an error, show error message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="card max-w-md w-full text-center">
          <div className="relative inline-block mx-auto mb-6">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-text-primary">Connection Error</h1>
          <p className="text-text-secondary mb-8">{error}</p>
          <Link href="/" className="btn btn-primary w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="card max-w-md w-full text-center">
          <div className="relative inline-block mx-auto mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-text-primary">Connecting to Clipboard</h1>
          <p className="text-text-secondary mb-2">Checking if clipboard exists...</p>
          <p className="text-text-accent font-mono tracking-wider text-lg">{roomCode}</p>
          <div className="mt-8 w-full bg-surface-hover h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse-slow rounded-full w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-surface border-b border-surface-hover backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-mesh rounded-lg flex items-center justify-center mr-3 shadow-glow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-text-primary">Clipboard</h1>
                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded">{roomCode}</span>
              </div>
              <div className="flex items-center text-text-secondary text-sm">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-1.5 animate-pulse"></span>
                  <span>{connectedUsers} {connectedUsers === 1 ? 'person' : 'people'} connected</span>
                </div>
                {expiresIn && (
                  <div className="flex items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Expires in {expiresIn}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <button 
              onClick={handleCopyLink} 
              className="btn btn-ghost"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <Link href="/" className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        {/* Add New Entry Card */}
        <div className="card mb-8 border-primary/20">
          <form onSubmit={handleAddEntry}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-text-secondary text-sm font-medium">New clipboard entry</label>
                <span className="text-xs text-text-secondary">Press Ctrl+Enter to submit</span>
              </div>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Type or paste content here..."
                className="w-full p-4 bg-surface-hover border border-surface-active rounded-md text-text-primary
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent min-h-[120px]
                placeholder:text-text-secondary/50 font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    handleAddEntry(e as any);
                  }
                }}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleClearClipboard}
                className="btn btn-ghost text-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Clipboard
              </button>
            </div>
          </form>
        </div>
        
        {/* Clipboard Entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-text-primary">Clipboard Entries</h2>
            <span className="text-text-secondary text-sm">{entries.length} {entries.length === 1 ? 'item' : 'items'}</span>
          </div>
          
          {entries.length === 0 ? (
            <div className="clipboard-entry border-dashed flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-secondary/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-text-secondary">No entries yet. Add your first entry above!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="clipboard-entry group hover:border-primary/30 hover:shadow-glow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-text-secondary text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(entry.createdAt)}
                  </div>
                  <div className="flex space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyEntry(entry.content, entry.id)}
                      className="icon-btn text-text-primary hover:text-primary"
                      title="Copy to clipboard"
                    >
                      {copied === entry.id ? (
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
                      onClick={() => handleDeleteEntry(entry.id)}
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
            ))
          )}
        </div>
      </main>
    </div>
  );
}
