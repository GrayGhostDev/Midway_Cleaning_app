import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';
import { ApiError } from '@/lib/api/errors';
import { logger } from '@/lib/api/logger';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  expiresAt: string | null;
  permissions: string[];
  rateLimit: {
    requests: number;
    duration: string;
  };
}

export class ApiKeyManager {
  private static readonly KEY_PREFIX = 'api_key:';
  private static readonly USAGE_PREFIX = 'api_key_usage:';

  static async createKey(
    name: string,
    permissions: string[] = ['*'],
    expiresIn?: number // in seconds
  ): Promise<ApiKey> {
    const id = nanoid();
    const key = `mk_${nanoid(32)}`;
    const createdAt = new Date().toISOString();
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;

    const apiKey: ApiKey = {
      id,
      key,
      name,
      createdAt,
      expiresAt,
      permissions,
      rateLimit: {
        requests: 1000,
        duration: '1h',
      },
    };

    await redis.set(
      `${this.KEY_PREFIX}${key}`,
      JSON.stringify(apiKey),
      expiresIn ? { ex: expiresIn } : undefined
    );

    logger.info('API key created', { id, name });

    return apiKey;
  }

  static async validateKey(key: string): Promise<ApiKey> {
    const apiKey = await redis.get<string>(`${this.KEY_PREFIX}${key}`);
    
    if (!apiKey) {
      throw ApiError.Unauthorized('Invalid API key');
    }

    const keyData: ApiKey = JSON.parse(apiKey);

    if (keyData.expiresAt && new Date(keyData.expiresAt) < new Date()) {
      await this.revokeKey(key);
      throw ApiError.Unauthorized('Expired API key');
    }

    return keyData;
  }

  static async revokeKey(key: string): Promise<void> {
    await redis.del(`${this.KEY_PREFIX}${key}`);
    logger.info('API key revoked', { key });
  }

  static async checkRateLimit(key: string): Promise<boolean> {
    const apiKey = await this.validateKey(key);
    const usageKey = `${this.USAGE_PREFIX}${key}`;
    
    const currentUsage = await redis.incr(usageKey);
    
    if (currentUsage === 1) {
      await redis.expire(
        usageKey,
        parseInt(apiKey.rateLimit.duration.replace('h', '')) * 3600
      );
    }

    return currentUsage <= apiKey.rateLimit.requests;
  }

  static async hasPermission(key: string, permission: string): Promise<boolean> {
    const apiKey = await this.validateKey(key);
    return (
      apiKey.permissions.includes('*') ||
      apiKey.permissions.includes(permission)
    );
  }
}

export async function validateApiKey(req: NextRequest): Promise<ApiKey> {
  const apiKey = req.headers.get('X-API-Key');

  if (!apiKey) {
    throw ApiError.Unauthorized('Missing API key');
  }

  const keyData = await ApiKeyManager.validateKey(apiKey);
  const hasRateLimit = await ApiKeyManager.checkRateLimit(apiKey);

  if (!hasRateLimit) {
    throw ApiError.TooManyRequests('Rate limit exceeded');
  }

  return keyData;
}

// Example usage of permissions
export const ApiPermissions = {
  TASKS: {
    READ: 'tasks:read',
    WRITE: 'tasks:write',
    DELETE: 'tasks:delete',
  },
  USERS: {
    READ: 'users:read',
    WRITE: 'users:write',
    DELETE: 'users:delete',
  },
  LOCATIONS: {
    READ: 'locations:read',
    WRITE: 'locations:write',
    DELETE: 'locations:delete',
  },
} as const;
