import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheAdapter } from '../../../domain/adapters';

@Injectable()
export class RedisIntegration extends CacheAdapter implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    super();
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get<T = string>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;

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
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}
