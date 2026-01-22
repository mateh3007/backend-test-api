import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis as UpstashRedis } from '@upstash/redis';
import { Redis as Ioredis } from 'ioredis';
import { CacheAdapter } from '../../../domain/adapters';

@Injectable()
export class RedisIntegration extends CacheAdapter implements OnModuleDestroy {
  private readonly logger = new Logger(RedisIntegration.name);
  private readonly client: UpstashRedis | Ioredis;
  private readonly isUpstash: boolean;

  constructor() {
    super();

    const redisRestUrl = process.env.REDIS_REST_URL;
    const redisRestToken = process.env.REDIS_REST_TOKEN;

    const redisUrl = process.env.REDIS_URL;

    if (redisRestUrl && redisRestToken) {
      this.isUpstash = true;
      this.client = new UpstashRedis({
        url: redisRestUrl,
        token: redisRestToken,
      });
      this.logger.log('🔌 Using Upstash Redis (REST API)');
    } else if (redisUrl) {
      this.isUpstash = false;
      this.client = new Ioredis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
      });
      this.setupIoredisEvents();
      this.logger.log('🔌 Using ioredis with connection URL');
    } else {
      this.isUpstash = false;
      this.client = new Ioredis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
      });
      this.setupIoredisEvents();
      this.logger.log('🔌 Using ioredis (local development)');
    }
  }

  private setupIoredisEvents(): void {
    const ioredisClient = this.client as Ioredis;
    ioredisClient.on('connect', () => {
      this.logger.log('🔌 Redis connected successfully');
    });

    ioredisClient.on('error', (error) => {
      this.logger.error(`❌ Redis connection error: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    this.logger.log('🔌 Disconnecting from Redis...');
    if (!this.isUpstash) {
      const ioredisClient = this.client as Ioredis;
      await ioredisClient.quit();
    }
  }

  async get<T = string>(key: string): Promise<T | null> {
    try {
      let value: string | null;

      if (this.isUpstash) {
        const upstashClient = this.client as UpstashRedis;
        value = await upstashClient.get(key);
      } else {
        const ioredisClient = this.client as Ioredis;
        value = await ioredisClient.get(key);
      }

      if (!value) {
        this.logger.log(`🔍 Redis GET [${key}] - Not found`);
        return null;
      }

      this.logger.log(`🔍 Redis GET [${key}] - Found`);

      if (this.isUpstash) {
        return value as T;
      }

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      this.logger.error(`❌ Redis GET error: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  async set<T = string>(key: string, value: T, ttl: number): Promise<void> {
    try {
      const serialized =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (this.isUpstash) {
        const upstashClient = this.client as UpstashRedis;
        await upstashClient.set(key, serialized, { ex: ttl });
      } else {
        const ioredisClient = this.client as Ioredis;
        await ioredisClient.set(key, serialized, 'EX', ttl);
      }

      this.logger.log(`💾 Redis SET [${key}] - TTL: ${ttl}s`);
    } catch (error) {
      this.logger.error(`❌ Redis SET error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.isUpstash) {
        const upstashClient = this.client as UpstashRedis;
        await upstashClient.del(key);
      } else {
        const ioredisClient = this.client as Ioredis;
        await ioredisClient.del(key);
      }

      this.logger.log(`🗑️ Redis DEL [${key}]`);
    } catch (error) {
      this.logger.error(`❌ Redis DEL error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async deleteByPattern(pattern: string): Promise<void> {
    try {
      let keys: string[];

      if (this.isUpstash) {
        const upstashClient = this.client as UpstashRedis;
        const result = await upstashClient.keys(pattern);
        keys = Array.isArray(result) ? result : [];
      } else {
        const ioredisClient = this.client as Ioredis;
        keys = await ioredisClient.keys(pattern);
      }

      if (keys.length > 0) {
        if (this.isUpstash) {
          const upstashClient = this.client as UpstashRedis;
          await Promise.all(keys.map((key) => upstashClient.del(key)));
        } else {
          const ioredisClient = this.client as Ioredis;
          await ioredisClient.del(...keys);
        }

        this.logger.log(
          `🗑️ Redis DEL by pattern [${pattern}] - Deleted ${keys.length} keys`,
        );
      } else {
        this.logger.log(`🗑️ Redis DEL by pattern [${pattern}] - No keys found`);
      }
    } catch (error) {
      this.logger.error(`❌ Redis DEL by pattern error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
