import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor() {
    // Initialize Redis client
    // In a production environment, these would be environment variables
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    
    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
      // Add password if needed in production
      // password: process.env.REDIS_PASSWORD,
    });
  }

  async onModuleInit() {
    try {
      await this.redisClient.ping();
      this.logger.log('Successfully connected to Redis');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    this.logger.log('Redis connection closed');
  }

  getClient(): Redis {
    return this.redisClient;
  }

  // Helper methods for clipboard operations

  async setWithExpiry(key: string, value: string, expiryInSeconds: number = 86400): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expiryInSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async getTTL(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  async refreshExpiry(key: string, expiryInSeconds: number = 86400): Promise<void> {
    await this.redisClient.expire(key, expiryInSeconds);
  }
}
