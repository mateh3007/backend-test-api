export abstract class CacheAdapter {
  abstract get<T = string>(key: string): Promise<T | null>;
  abstract set<T = string>(key: string, value: T, ttl: number): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract deleteByPattern(pattern: string): Promise<void>;
}
