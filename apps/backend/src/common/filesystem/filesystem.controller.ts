import { Controller, Get, Param, Res, Req, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { FilesystemService } from './filesystem.service';
import * as path from 'path';
import * as mime from 'mime-types';

@Controller('files')
export class FilesystemController {
  constructor(private readonly filesystemService: FilesystemService) {}

  @Get(':roomCode/:fileName')
  async serveFile(
    @Param('roomCode') roomCode: string,
    @Param('fileName') fileName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const fileBuffer = await this.filesystemService.getFile(roomCode, fileName);
      
      // Determine content type
      const contentType = mime.lookup(fileName) || 'application/octet-stream';
      
      // Set appropriate headers
      res.setHeader('Content-Type', contentType);
      
      // Check if the request has a 'download' query parameter
      const downloadHeader = req.query.download === 'true' 
        ? `attachment; filename="${fileName}"` 
        : `inline; filename="${fileName}"`;
      
      res.setHeader('Content-Disposition', downloadHeader);
      
      // Send the file
      return res.send(fileBuffer);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
