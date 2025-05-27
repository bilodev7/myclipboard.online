import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ClipboardService } from './clipboard.service';

@Controller('clipboard')
export class ClipboardController {
  constructor(private readonly clipboardService: ClipboardService) {}

  @Post('create')
  async createClipboard(@Body() body: { password?: string }) {
    try {
      const roomCode = await this.clipboardService.createClipboard(body.password);
      return { roomCode };
    } catch (error) {
      throw new HttpException('Failed to create clipboard', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':roomCode/exists')
  async clipboardExists(@Param('roomCode') roomCode: string) {
    const exists = await this.clipboardService.clipboardExists(roomCode);
    
    if (!exists) {
      return { exists: false, hasPassword: false };
    }
    
    // Get the clipboard to check if it has a password
    const clipboard = await this.clipboardService.getClipboard(roomCode);
    const hasPassword = clipboard?.password ? true : false;
    
    return { exists, hasPassword };
  }

  @Post(':roomCode/verify')
  async verifyPassword(
    @Param('roomCode') roomCode: string,
    @Body() body: { password: string },
  ) {
    const isValid = await this.clipboardService.verifyPassword(roomCode, body.password);
    
    if (!isValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    
    return { success: true };
  }

  @Post(':roomCode/refresh')
  async refreshExpiration(@Param('roomCode') roomCode: string) {
    const success = await this.clipboardService.refreshExpiration(roomCode);
    
    if (!success) {
      throw new HttpException('Clipboard not found', HttpStatus.NOT_FOUND);
    }
    
    return { success };
  }
}
