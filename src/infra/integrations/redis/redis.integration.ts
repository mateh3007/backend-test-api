import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheAdapter } from '../../../domain/adapters';

@Injectable()
export class RedisIntegration extends CacheAdapter implements OnModuleDestroy {
  private readonly logger = new Logger(RedisIntegration.name);
  private readonly client: Redis;

  constructor() {
    super();
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.client.on('connect', () => {
      this.logger.log('🔌 Redis connected successfully');
    });

    this.client.on('error', (error) => {
      this.logger.error(`❌ Redis connection error: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    this.logger.log('🔌 Disconnecting from Redis...');
    await this.client.quit();
  }

  async get<T = string>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) {
      this.logger.log(`🔍 Redis GET [${key}] - Not found`);
      return null;
    }

    this.logger.log(`🔍 Redis GET [${key}] - Found`);

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set<T = string>(key: string, value: T, ttl: number): Promise<void> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.set(key, serialized, 'EX', ttl);
    this.logger.log(`💾 Redis SET [${key}] - TTL: ${ttl}s`);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
    this.logger.log(`🗑️ Redis DEL [${key}]`);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
      this.logger.log(
        `🗑️ Redis DEL by pattern [${pattern}] - Deleted ${keys.length} keys`,
      );
    } else {
      this.logger.log(`🗑️ Redis DEL by pattern [${pattern}] - No keys found`);
    }
  }
}
