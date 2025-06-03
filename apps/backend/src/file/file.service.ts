import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FilesystemService } from '../common/filesystem/filesystem.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { v4 as uuidv4 } from 'uuid';

export interface FileEntry {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  storageKey: string;
  createdAt: string;
  createdBy: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly filesystemService: FilesystemService,
    private readonly clipboardService: ClipboardService,
  ) {}

  async uploadFile(
    roomCode: string,
    file: Express.Multer.File,
    clientId: string,
  ): Promise<FileEntry> {
    // Check if clipboard exists
    const clipboard = await this.clipboardService.getClipboard(roomCode);
    if (!clipboard) {
      throw new NotFoundException(`Clipboard ${roomCode} not found`);
    }

    // Generate unique ID for file
    const fileId = uuidv4();
    const fileName = `${fileId}-${file.originalname}`;

    // Upload file to filesystem
    await this.filesystemService.uploadFile(file, roomCode, fileName);

    // Create file entry
    const fileEntry: FileEntry = {
      id: fileId,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      storageKey: `${roomCode}/${fileName}`,
      createdAt: new Date().toISOString(),
      createdBy: clientId,
    };

    // Add file to clipboard
    if (!clipboard.files) {
      clipboard.files = [];
    }
    clipboard.files.unshift(fileEntry);
    clipboard.lastActivity = new Date().toISOString();

    // Save updated clipboard
    await this.clipboardService.saveClipboard(roomCode, clipboard);

    return fileEntry;
  }

  async getFileUrl(roomCode: string, fileId: string): Promise<string> {
    const fileData = await this.getFileData(roomCode, fileId);
    return fileData.url;
  }

  async getFileData(roomCode: string, fileId: string): Promise<{ url: string; filename: string; fileEntry: FileEntry }> {
    const clipboard = await this.clipboardService.getClipboard(roomCode);
    if (!clipboard || !clipboard.files) {
      throw new NotFoundException(`Clipboard ${roomCode} not found`);
    }

    const fileEntry = clipboard.files.find(file => file.id === fileId);
    if (!fileEntry) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    // Return the URL to the file controller with the correct API path
    const [roomCodeFromPath, fileName] = fileEntry.storageKey.split('/');
    return {
      url: `/api/files/${roomCodeFromPath}/${fileName}`,
      filename: fileEntry.filename,
      fileEntry
    };
  }

  async deleteFile(roomCode: string, fileId: string): Promise<boolean> {
    const clipboard = await this.clipboardService.getClipboard(roomCode);
    if (!clipboard || !clipboard.files) {
      throw new NotFoundException(`Clipboard ${roomCode} not found`);
    }

    const fileIndex = clipboard.files.findIndex(file => file.id === fileId);
    if (fileIndex === -1) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    const fileEntry = clipboard.files[fileIndex];

    // Delete file from filesystem
    const [roomCodeFromPath, fileName] = fileEntry.storageKey.split('/');
    await this.filesystemService.deleteFile(roomCodeFromPath, fileName);

    // Remove file entry from clipboard
    clipboard.files.splice(fileIndex, 1);
    clipboard.lastActivity = new Date().toISOString();

    // Save updated clipboard
    await this.clipboardService.saveClipboard(roomCode, clipboard);

    return true;
  }
}
