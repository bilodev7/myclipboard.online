import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FilesystemModule } from '../common/filesystem/filesystem.module';
import { ClipboardModule } from '../clipboard/clipboard.module';

@Module({
  imports: [FilesystemModule, ClipboardModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
