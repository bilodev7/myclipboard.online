import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  MaxFileSizeValidator,
  ParseFilePipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('clipboard/:roomCode/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('roomCode') roomCode: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('clientId') clientId: string,
  ) {
    try {
      const fileEntry = await this.fileService.uploadFile(
        roomCode,
        file,
        clientId,
      );
      return fileEntry;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':fileId')
  async getFile(
    @Param('roomCode') roomCode: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    try {
      const fileData = await this.fileService.getFileData(roomCode, fileId);
      const fileUrl = fileData.url;
      
      // If there's a filename parameter in the query, append it to the redirect URL
      const originalFilename = res.req.query.filename;
      const redirectUrl = originalFilename 
        ? `${fileUrl}?download=true&originalName=${encodeURIComponent(originalFilename.toString())}` 
        : fileUrl;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get file',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':fileId')
  async deleteFile(
    @Param('roomCode') roomCode: string,
    @Param('fileId') fileId: string,
  ) {
    try {
      const success = await this.fileService.deleteFile(roomCode, fileId);
      return { success };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
