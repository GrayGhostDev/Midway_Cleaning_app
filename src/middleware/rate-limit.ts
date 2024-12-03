import { Redis } from 'ioredis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequestIp } from '@/utils/request';

const redis = new Redis(process.env.REDIS_URL!);

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max number of requests per window
  message?: string;  // Custom error message
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 100,           // 100 requests per minute
  message: 'Too many requests, please try again later',
};

export async function rateLimit(
  req: NextRequest,
  config: Partial<RateLimitConfig> = {}
) {
  const { windowMs, max, message } = { ...defaultConfig, ...config };
  const ip = getRequestIp(req);
  const key = `rate-limit:${ip}:${req.nextUrl.pathname}`;

  try {
    // Use Redis MULTI to ensure atomic operations
    const multi = redis.multi();
    
    // Get current count
    multi.get(key);
    // Increment count
    multi.incr(key);
    // Set expiry if key is new
    multi.expire(key, Math.ceil(windowMs / 1000));

    const results = await multi.exec();
    if (!results) throw new Error('Redis transaction failed');

    const [, [, count]] = results;
    const remaining = Math.max(0, max - (count as number));

    // Set rate limit headers
    const headers = new Headers({
      'X-RateLimit-Limit': max.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': (Date.now() + windowMs).toString(),
    });

    // If limit exceeded, return error response
    if (count > max) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: message || defaultConfig.message,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(headers.entries()),
          },
        }
      );
    }

    // Add headers to original response
    const response = NextResponse.next();
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow request to proceed but log the error
    return NextResponse.next();
  }
}

// Specialized rate limiters for different endpoints
export const apiRateLimit = (req: NextRequest) =>
  rateLimit(req, {
    windowMs: 60 * 1000,     // 1 minute
    max: 100,                // 100 requests per minute
  });

export const authRateLimit = (req: NextRequest) =>
  rateLimit(req, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                   // 5 attempts
    message: 'Too many login attempts, please try again later',
  });

export const uploadRateLimit = (req: NextRequest) =>
  rateLimit(req, {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,                  // 10 uploads
    message: 'Upload limit exceeded, please try again later',
  });

export const websocketRateLimit = (req: NextRequest) =>
  rateLimit(req, {
    windowMs: 60 * 1000,     // 1 minute
    max: 60,                 // 60 messages per minute
    message: 'Message rate limit exceeded, please slow down',
  });
