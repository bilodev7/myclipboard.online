import { Module } from '@nestjs/common';
import { ClipboardModule } from './clipboard/clipboard.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ClipboardModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
