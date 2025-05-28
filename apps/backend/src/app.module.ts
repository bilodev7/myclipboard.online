import { Module } from '@nestjs/common';
import { ClipboardModule } from './clipboard/clipboard.module';
import { RedisModule } from './common/redis/redis.module';
import { FileModule } from './file/file.module';
import { FilesystemModule } from './common/filesystem/filesystem.module';

@Module({
  imports: [
    ClipboardModule,
    RedisModule,
    FileModule,
    FilesystemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
