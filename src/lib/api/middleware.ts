import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import { logger } from './logger';
import { ApiError } from './errors';

// Initialize rate limiter
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});

// Middleware composition helper
export const compose = (...middlewares: any[]) => {
  return async (req: NextRequest, ...args: any[]) => {
    const runner = async (index: number): Promise<NextResponse> => {
      if (index === middlewares.length) {
        return NextResponse.next();
      }
      return await middlewares[index](req, ...args, () => runner(index + 1));
    };
    return await runner(0);
  };
};

// Request validation middleware
export const validateRequest = (schema: z.ZodType) => {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      schema.parse(body);
      return NextResponse.next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(400, 'Validation Error', error.errors);
      }
      throw error;
    }
  };
};

// Rate limiting middleware
export const rateLimiter = async (req: NextRequest) => {
  try {
    const ip = req.ip ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      throw new ApiError(429, 'Too Many Requests', {
        limit,
        reset,
        remaining,
      });
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Rate Limiting Error');
  }
};

// Request logging middleware
export const requestLogger = async (req: NextRequest) => {
  const start = Date.now();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers.get('user-agent');

  logger.info('Incoming request', {
    method,
    url,
    userAgent,
  });

  const response = NextResponse.next();

  const duration = Date.now() - start;
  const status = response.status;

  logger.info('Request completed', {
    method,
    url,
    status,
    duration,
  });

  return response;
};

// API versioning middleware
export const apiVersion = (version: string) => {
  return async (req: NextRequest) => {
    const response = NextResponse.next();
    response.headers.set('X-API-Version', version);
    return response;
  };
};

// Error handling middleware
export const errorHandler = async (req: NextRequest, error: any) => {
  if (error instanceof ApiError) {
    logger.warn('API Error', {
      status: error.status,
      message: error.message,
      details: error.details,
    });

    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.status }
    );
  }

  logger.error('Unhandled Error', {
    error: error.message,
    stack: error.stack,
  });

  return NextResponse.json(
    {
      error: 'Internal Server Error',
    },
    { status: 500 }
  );
};

// CORS middleware
export const cors = async (req: NextRequest) => {
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { status: 200 });
  }

  return response;
};
