'use client';

import { useState, useEffect } from 'react';

interface SavedClipboard {
  roomCode: string;
  lastVisited: string; // ISO date string
  name?: string; // Optional custom name
}

export function useSavedClipboards() {
  const [savedClipboards, setSavedClipboards] = useState<SavedClipboard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
    isLoaded
  };
}
