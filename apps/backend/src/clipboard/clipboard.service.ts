import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../common/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

export interface ClipboardEntry {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Clipboard {
  id: string;
  entries: ClipboardEntry[];
  password?: string;
  createdAt: string;
  lastActivity: string;
}

@Injectable()
export class ClipboardService {
  private readonly logger = new Logger(ClipboardService.name);
  private readonly CLIPBOARD_PREFIX = 'clipboard:';
  private readonly CLIPBOARD_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

  constructor(private readonly redisService: RedisService) {}

  /**
   * Generate a new room code for a clipboard
   */
  generateRoomCode(): string {
    // Generate a 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Create a new clipboard
   */
  async createClipboard(password?: string): Promise<string> {
    let roomCode = this.generateRoomCode();
    let exists = await this.clipboardExists(roomCode);
    
    // Ensure we generate a unique room code
    while (exists) {
      roomCode = this.generateRoomCode();
      exists = await this.clipboardExists(roomCode);
    }
    
    const now = new Date().toISOString();
    const clipboard: Clipboard = {
      id: roomCode,
      entries: [],
      password,
      createdAt: now,
      lastActivity: now,
    };
    
    await this.saveClipboard(roomCode, clipboard);
    return roomCode;
  }

  /**
   * Create a new clipboard with a specific room code
   */
  async createClipboardWithCode(roomCode: string, password?: string): Promise<boolean> {
    // Check if clipboard already exists
    const exists = await this.clipboardExists(roomCode);
    if (exists) {
      return false; // Cannot create a clipboard that already exists
    }
    
    const now = new Date().toISOString();
    const clipboard: Clipboard = {
      id: roomCode,
      entries: [],
      password,
      createdAt: now,
      lastActivity: now,
    };
    
    await this.saveClipboard(roomCode, clipboard);
    return true;
  }

  /**
   * Get a clipboard by room code
   */
  async getClipboard(roomCode: string): Promise<Clipboard | null> {
    const key = this.getClipboardKey(roomCode);
    const data = await this.redisService.get(key);
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data);
  }

  /**
   * Check if a clipboard exists
   */
  async clipboardExists(roomCode: string): Promise<boolean> {
    const key = this.getClipboardKey(roomCode);
    return this.redisService.exists(key);
  }

  /**
   * Verify clipboard password
   */
  async verifyPassword(roomCode: string, password: string): Promise<boolean> {
    const clipboard = await this.getClipboard(roomCode);
    
    if (!clipboard) {
      return false;
    }
    
    // If no password is set, or passwords match
    return !clipboard.password || clipboard.password === password;
  }

  /**
   * Add an entry to a clipboard
   */
  async addEntry(roomCode: string, content: string, clientId: string): Promise<ClipboardEntry | null> {
    const clipboard = await this.getClipboard(roomCode);
    
    if (!clipboard) {
      return null;
    }
    
    const entry: ClipboardEntry = {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: clientId,
    };
    
    clipboard.entries.unshift(entry); // Add to the beginning of the array
    clipboard.lastActivity = new Date().toISOString();
    
    await this.saveClipboard(roomCode, clipboard);
    return entry;
  }

  /**
   * Delete an entry from a clipboard
   */
  async deleteEntry(roomCode: string, entryId: string): Promise<boolean> {
    const clipboard = await this.getClipboard(roomCode);
    
    if (!clipboard) {
      return false;
    }
    
    const initialLength = clipboard.entries.length;
    clipboard.entries = clipboard.entries.filter(entry => entry.id !== entryId);
    
    if (clipboard.entries.length === initialLength) {
      return false; // No entry was deleted
    }
    
    clipboard.lastActivity = new Date().toISOString();
    await this.saveClipboard(roomCode, clipboard);
    return true;
  }

  /**
   * Clear all entries from a clipboard
   */
  async clearClipboard(roomCode: string): Promise<boolean> {
    const clipboard = await this.getClipboard(roomCode);
    
    if (!clipboard) {
      return false;
    }
    
    clipboard.entries = [];
    clipboard.lastActivity = new Date().toISOString();
    
    await this.saveClipboard(roomCode, clipboard);
    return true;
  }

  /**
   * Get the time until clipboard expiration
   */
  async getExpirationTime(roomCode: string): Promise<string | null> {
    const key = this.getClipboardKey(roomCode);
    const ttl = await this.redisService.getTTL(key);
    
    if (ttl <= 0) {
      return null;
    }
    
    // Format the expiration time
    if (ttl < 60 * 60) {
      // Less than an hour
      const minutes = Math.ceil(ttl / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    } else {
      // Hours
      const hours = Math.ceil(ttl / (60 * 60));
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
  }

  /**
   * Refresh the expiration time for a clipboard
   */
  async refreshExpiration(roomCode: string): Promise<boolean> {
    const key = this.getClipboardKey(roomCode);
    const exists = await this.redisService.exists(key);
    
    if (!exists) {
      return false;
    }
    
    await this.redisService.refreshExpiry(key, this.CLIPBOARD_EXPIRY);
    return true;
  }

  /**
   * Save a clipboard to Redis
   */
  private async saveClipboard(roomCode: string, clipboard: Clipboard): Promise<void> {
    const key = this.getClipboardKey(roomCode);
    await this.redisService.setWithExpiry(
      key,
      JSON.stringify(clipboard),
      this.CLIPBOARD_EXPIRY
    );
  }

  /**
   * Get the Redis key for a clipboard
   */
  private getClipboardKey(roomCode: string): string {
    return `${this.CLIPBOARD_PREFIX}${roomCode}`;
  }
}
