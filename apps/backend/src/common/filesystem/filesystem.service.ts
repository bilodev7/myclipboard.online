import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

@Injectable()
export class FilesystemService {
  private readonly logger = new Logger(FilesystemService.name);
  private readonly uploadDir: string;

  constructor() {
    // Create uploads directory in the project root
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    this.initUploadDir().catch(err => {
      this.logger.error(`Failed to initialize upload directory: ${err.message}`);
    });
  }

  private async initUploadDir(): Promise<void> {
    if (!await existsAsync(this.uploadDir)) {
      await mkdirAsync(this.uploadDir, { recursive: true });
      this.logger.log(`Upload directory '${this.uploadDir}' created successfully`);
    }
  }

  async uploadFile(file: Express.Multer.File, roomCode: string, fileName: string): Promise<string> {
    // Create room directory if it doesn't exist
    const roomDir = path.join(this.uploadDir, roomCode);
    if (!await existsAsync(roomDir)) {
      await mkdirAsync(roomDir, { recursive: true });
    }

    // Save file to disk
    const filePath = path.join(roomDir, fileName);
    await writeFileAsync(filePath, file.buffer);
    
    // Return the relative path to the file
    return `/${roomCode}/${fileName}`;
  }

  async getFile(roomCode: string, fileName: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, roomCode, fileName);
    return await readFileAsync(filePath);
  }

  async deleteFile(roomCode: string, fileName: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, roomCode, fileName);
      await unlinkAsync(filePath);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      return false;
    }
  }

  async deleteRoomFiles(roomCode: string): Promise<boolean> {
    try {
      const roomDir = path.join(this.uploadDir, roomCode);
      if (await existsAsync(roomDir)) {
        // Delete all files in the directory
        const files = fs.readdirSync(roomDir);
        for (const file of files) {
          await unlinkAsync(path.join(roomDir, file));
        }
        
        // Remove the directory itself
        fs.rmdirSync(roomDir);
      }
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete room files: ${error.message}`);
      return false;
    }
  }
}
