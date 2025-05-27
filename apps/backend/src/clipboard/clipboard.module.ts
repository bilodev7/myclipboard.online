import { Module } from '@nestjs/common';
import { ClipboardService } from './clipboard.service';
import { ClipboardGateway } from './clipboard.gateway';
import { ClipboardController } from './clipboard.controller';

@Module({
  providers: [ClipboardService, ClipboardGateway],
  controllers: [ClipboardController],
  exports: [ClipboardService],
})
export class ClipboardModule {}
