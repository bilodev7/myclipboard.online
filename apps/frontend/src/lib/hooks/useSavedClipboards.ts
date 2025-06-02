'use client';

import { useState, useEffect } from 'react';
import { apiUrl } from '../constants';

interface SavedClipboard {
  roomCode: string;
  lastVisited: string; // ISO date string
  name?: string; // Optional custom name
  isExpired?: boolean; // Whether the clipboard has expired
  isPasswordProtected?: boolean; // Whether the clipboard is password protected
  lastChecked?: string; // When the clipboard status was last checked
}

export function useSavedClipboards() {
  const [savedClipboards, setSavedClipboards] = useState<SavedClipboard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Load saved clipboards from localStorage
  useEffect(() => {
    const loadSavedClipboards = () => {
      try {
        const saved = localStorage.getItem('savedClipboards');
        if (saved) {
          setSavedClipboards(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load saved clipboards:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSavedClipboards();
  }, []);

  // Save clipboards to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('savedClipboards', JSON.stringify(savedClipboards));
    }
  }, [savedClipboards, isLoaded]);

  // Check clipboard status (expired and password-protected)
  useEffect(() => {
    const checkClipboardStatus = async () => {
      if (!isLoaded || savedClipboards.length === 0 || isCheckingStatus) {
        return;
      }

      setIsCheckingStatus(true);
      const now = new Date();
      const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // Create a copy of the clipboards array to update
      const updatedClipboards = [...savedClipboards];
      let hasChanges = false;

      // Check each clipboard that hasn't been checked in the last hour
      for (let i = 0; i < updatedClipboards.length; i++) {
        const clipboard = updatedClipboards[i];
        const lastChecked = clipboard.lastChecked ? new Date(clipboard.lastChecked) : null;
        
        // Skip if checked within the last hour
        if (lastChecked && (now.getTime() - lastChecked.getTime() < ONE_HOUR)) {
          continue;
        }
        
        try {
          const response = await fetch(`${apiUrl}/clipboard/${clipboard.roomCode}/exists`);
          
          if (response.ok) {
            const data = await response.json();
            
            // Update clipboard status
            if (clipboard.isExpired !== !data.exists || clipboard.isPasswordProtected !== data.hasPassword) {
              updatedClipboards[i] = {
                ...clipboard,
                isExpired: !data.exists,
                isPasswordProtected: data.hasPassword,
                lastChecked: now.toISOString()
              };
              hasChanges = true;
            } else if (!clipboard.lastChecked) {
              // Just update the lastChecked timestamp if nothing else changed
              updatedClipboards[i] = {
                ...clipboard,
                lastChecked: now.toISOString()
              };
              hasChanges = true;
            }
          }
        } catch (error) {
          console.error(`Failed to check status for clipboard ${clipboard.roomCode}:`, error);
          // If we can't reach the server, don't mark as expired
        }
      }

      if (hasChanges) {
        setSavedClipboards(updatedClipboards);
      }
      
      setIsCheckingStatus(false);
    };

    checkClipboardStatus();
  }, [isLoaded, savedClipboards]);

  // Add a clipboard to saved list
  const addClipboard = (roomCode: string, name?: string) => {
    setSavedClipboards(prev => {
      // Check if the clipboard already exists
      const existingIndex = prev.findIndex(item => item.roomCode === roomCode);
      
      // Create a new array to avoid mutation
      const newSavedClipboards = [...prev];
      const now = new Date().toISOString();
      
      if (existingIndex >= 0) {
        // Update existing clipboard with new timestamp
        newSavedClipboards[existingIndex] = {
          ...newSavedClipboards[existingIndex],
          lastVisited: now,
          name: name || newSavedClipboards[existingIndex].name
        };
      } else {
        // Add new clipboard
        newSavedClipboards.unshift({
          roomCode,
          lastVisited: now,
          name
        });
      }
      
      // Limit to 10 recent clipboards
      return newSavedClipboards.slice(0, 10);
    });
  };

  // Remove a clipboard from saved list
  const removeClipboard = (roomCode: string) => {
    setSavedClipboards(prev => 
      prev.filter(item => item.roomCode !== roomCode)
    );
  };

  // Clear all saved clipboards
  const clearClipboards = () => {
    setSavedClipboards([]);
  };

  // Rename a saved clipboard
  const renameClipboard = (roomCode: string, newName: string) => {
    setSavedClipboards(prev => 
      prev.map(item => 
        item.roomCode === roomCode 
          ? { ...item, name: newName || undefined } 
          : item
      )
    );
  };

  return {
    savedClipboards,
    addClipboard,
    removeClipboard,
    clearClipboards,
    renameClipboard,
    isLoaded,
    isCheckingStatus
  };
}
