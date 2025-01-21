import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequestIp } from '../utils/request';

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

interface RateLimitConfig {
  window: number;  // Time window in milliseconds
  max: number;     // Max number of requests per window
}

const defaultConfig: RateLimitConfig = {
  window: 60 * 1000, // 1 minute
  max: 100,         // 100 requests per minute
};

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = defaultConfig
) {
  const ip = getRequestIp(request);
  const key = `rate-limit:${ip}`;
  
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, config.window / 1000);
  }

  const headers = new Headers({
    'X-RateLimit-Limit': config.max.toString(),
    'X-RateLimit-Remaining': Math.max(0, config.max - current).toString(),
    'X-RateLimit-Reset': (Date.now() + config.window).toString(),
  });

  if (current > config.max) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers
    });
  }

  const response = NextResponse.next();
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

// Specialized rate limiters with different configurations
export const apiRateLimit = (req: NextRequest) =>
  rateLimit(req, { window: 60 * 1000, max: 100 });

export const authRateLimit = (req: NextRequest) =>
  rateLimit(req, { window: 15 * 60 * 1000, max: 5 });

export const uploadRateLimit = (req: NextRequest) =>
  rateLimit(req, { window: 60 * 60 * 1000, max: 10 });

export const websocketRateLimit = (req: NextRequest) =>
  rateLimit(req, { window: 60 * 1000, max: 60 });
