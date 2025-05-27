import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { ClipboardEntryType } from '@/app/[roomCode]/components/ClipboardEntry';

interface UseSocketManagerOptions {
  roomCode: string;
  clientId: string;
}

interface UseSocketManagerResult {
  entries: ClipboardEntryType[];
  connectedUsers: number;
  expiresIn: string | null;
  isLoading: boolean;
  error: string | null;
  socketRef: React.MutableRefObject<Socket | null>;
  addEntry: (content: string) => void;
  deleteEntry: (entryId: string) => void;
  clearClipboard: () => void;
}

export function useSocketManager({ roomCode, clientId }: UseSocketManagerOptions): UseSocketManagerResult {
  const [entries, setEntries] = useState<ClipboardEntryType[]>([]);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [expiresIn, setExpiresIn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const dataLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Socket event handlers
  const addEntry = (content: string) => {
    if (socketRef.current) {
      socketRef.current.emit('addEntry', {
        roomCode,
        content,
        clientId,
      });
    }
  };

  const deleteEntry = (entryId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('deleteEntry', {
        roomCode,
        entryId,
        clientId,
      });
    }
  };

  const clearClipboard = () => {
    if (socketRef.current) {
      socketRef.current.emit('clearClipboard', {
        roomCode,
        clientId,
      });
    }
  };

  // Validate room code format (6 alphanumeric characters, uppercase)
  const isValidRoomCode = (code: string): boolean => {
    const roomCodeRegex = /^[A-Z0-9]{6}$/;
    return roomCodeRegex.test(code);
  };

  useEffect(() => {
    // Validate room code format before connecting
    if (!isValidRoomCode(roomCode)) {
      setError(`Invalid clipboard code format: ${roomCode}. Please use a 6-character uppercase alphanumeric code.`);
      setIsLoading(false);
      return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    // Connect to the Socket.io server with explicit transport options
    socketRef.current = io(SOCKET_URL, {
      query: { roomCode },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
    });

    // Handle connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Join the room after successful connection
      if (socketRef.current) {
        socketRef.current.emit('joinRoom', { roomCode, clientId });
      }

      // Set a timeout for receiving initial clipboard data
      if (dataLoadTimeoutRef.current) clearTimeout(dataLoadTimeoutRef.current);
      dataLoadTimeoutRef.current = setTimeout(() => {
        if (isLoading) { // Only if still loading
          console.warn(`Timeout: Did not receive clipboardData for room ${roomCode} in time.`);
          setError('Failed to load clipboard data in time. Please check your connection or try refreshing.');
          setIsLoading(false);
        }
      }, 10000); // 10 seconds timeout
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
      
      // If clipboard not found, redirect back to home after a delay
      // The backend now handles non-existent rooms by disconnecting, 
      // but this client-side redirect can be a fallback or for specific error messages.
      if (data.message.toLowerCase().includes('not found') || data.message.toLowerCase().includes('does not exist')) {
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    });

    // Listen for initial clipboard data
    socketRef.current.on('clipboardData', (data: { entries: ClipboardEntryType[], connectedUsers: number, expiresIn?: string }) => {
      if (dataLoadTimeoutRef.current) clearTimeout(dataLoadTimeoutRef.current); // Clear timeout
      setEntries(data.entries);
      setConnectedUsers(data.connectedUsers);
      if (data.expiresIn) {
        setExpiresIn(data.expiresIn);
      }
      setIsLoading(false);
    });

    // Listen for new entries
    socketRef.current.on('newEntry', (entry: ClipboardEntryType) => {
      setEntries((prev: ClipboardEntryType[]) => [entry, ...prev]);
    });

    // Listen for deleted entries
    socketRef.current.on('deleteEntry', (entryId: string) => {
      setEntries((prev: ClipboardEntryType[]) => prev.filter(entry => entry.id !== entryId));
    });

    // Listen for user count updates
    socketRef.current.on('userCount', (count: number) => {
      setConnectedUsers(count);
    });

    // Listen for expiration updates
    socketRef.current.on('expirationUpdate', (time: string) => {
      setExpiresIn(time);
    });

    // Cleanup on unmount
    return () => {
      console.log(`Cleaning up SocketManager for ${roomCode}`);
      if (dataLoadTimeoutRef.current) {
        clearTimeout(dataLoadTimeoutRef.current);
      }
      if (socketRef.current) {
        // Turn off all specific listeners
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('disconnect');
        socketRef.current.off('error');
        socketRef.current.off('clipboardData');
        socketRef.current.off('newEntry');
        socketRef.current.off('deleteEntry');
        socketRef.current.off('userCount');
        socketRef.current.off('expirationUpdate');
        
        // Then disconnect
        if (socketRef.current.connected) {
          socketRef.current.disconnect();
        }
        socketRef.current = null; // Help with garbage collection and prevent reuse
      }
    };
  }, [roomCode, clientId, isLoading]);

  return {
    entries,
    connectedUsers,
    expiresIn,
    isLoading,
    error,
    socketRef,
    addEntry,
    deleteEntry,
    clearClipboard
  };
}
