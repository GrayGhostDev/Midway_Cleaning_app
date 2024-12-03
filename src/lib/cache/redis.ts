import { Redis } from '@upstash/redis';
import { logger } from '@/lib/api/logger';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface CacheConfig {
  ttl?: number;
  prefix?: string;
}

export class CacheManager {
  private static defaultTTL = 3600; // 1 hour
  private static prefix = 'midway:';

  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(`${this.prefix}${key}`);
      return data as T;
    } catch (error) {
      logger.error('Cache get error', { key, error });
      return null;
    }
  }

  static async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const cacheKey = `${this.prefix}${key}`;
      if (ttl) {
        await redis.setex(cacheKey, ttl, value);
      } else {
        await redis.set(cacheKey, value);
      }
    } catch (error) {
      logger.error('Cache set error', { key, error });
    }
  }

  static async delete(key: string): Promise<void> {
    try {
      await redis.del(`${this.prefix}${key}`);
    } catch (error) {
      logger.error('Cache delete error', { key, error });
    }
  }

  static async clear(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(`${this.prefix}${pattern}`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache clear error', { pattern, error });
    }
  }

  // Memoization helper
  static memoize<T>(
    fn: (...args: any[]) => Promise<T>,
    keyPrefix: string,
    ttl?: number
  ) {
    return async (...args: any[]): Promise<T> => {
      const key = `${keyPrefix}:${JSON.stringify(args)}`;
      const cached = await this.get<T>(key);
      
      if (cached !== null) {
        return cached;
      }

      const result = await fn(...args);
      await this.set(key, result, ttl || this.defaultTTL);
      return result;
    };
  }

  // Rate limiting helper
  static async rateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<boolean> {
    const current = await redis.incr(`${this.prefix}ratelimit:${key}`);
    if (current === 1) {
      await redis.expire(`${this.prefix}ratelimit:${key}`, window);
    }
    return current <= limit;
  }

  // Cache warming helper
  static async warmCache<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<void> {
    try {
      const value = await fn();
      await this.set(key, value, ttl);
    } catch (error) {
      logger.error('Cache warming error', { key, error });
    }
  }

  // Batch operations
  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const cacheKeys = keys.map(key => `${this.prefix}${key}`);
      const values = await redis.mget(...cacheKeys);
      return values as (T | null)[];
    } catch (error) {
      logger.error('Cache mget error', { keys, error });
      return keys.map(() => null);
    }
  }

  static async mset(
    entries: { key: string; value: any; ttl?: number }[]
  ): Promise<void> {
    try {
      const pipeline = redis.pipeline();
      
      entries.forEach(({ key, value, ttl }) => {
        const cacheKey = `${this.prefix}${key}`;
        if (ttl) {
          pipeline.setex(cacheKey, ttl, value);
        } else {
          pipeline.set(cacheKey, value);
        }
      });

      await pipeline.exec();
    } catch (error) {
      logger.error('Cache mset error', { entries, error });
    }
  }
}

// Example usage:
// const cachedFn = CacheManager.memoize(
//   async (id: string) => {
//     const data = await fetchExpensiveData(id);
//     return data;
//   },
//   'expensive-data',
//   3600
// );
