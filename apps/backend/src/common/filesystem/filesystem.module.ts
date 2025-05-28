import { Module } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';
import { FilesystemController } from './filesystem.controller';

@Module({
  providers: [FilesystemService],
  controllers: [FilesystemController],
  exports: [FilesystemService],
})
export class FilesystemModule {}
