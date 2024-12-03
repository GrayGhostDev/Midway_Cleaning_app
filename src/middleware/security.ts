import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SecurityConfig {
  cors?: {
    origin?: string | string[] | ((origin: string) => boolean);
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  };
  csp?: {
    directives?: Record<string, string[]>;
  };
}

const defaultConfig: SecurityConfig = {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'", 'wss:', 'https:'],
      'frame-ancestors': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    },
  },
};

export function security(config: SecurityConfig = {}) {
  const mergedConfig = {
    cors: { ...defaultConfig.cors, ...config.cors },
    csp: {
      directives: {
        ...defaultConfig.csp?.directives,
        ...config.csp?.directives,
      },
    },
  };

  return async (req: NextRequest) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(req, mergedConfig.cors),
      });
    }

    // Add security headers to response
    const response = NextResponse.next();
    const headers = {
      ...getCorsHeaders(req, mergedConfig.cors),
      ...getSecurityHeaders(mergedConfig),
    };

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

function getCorsHeaders(req: NextRequest, corsConfig: SecurityConfig['cors'] = {}) {
  const origin = req.headers.get('origin');
  const headers: Record<string, string> = {};

  // Handle origin
  if (origin) {
    if (typeof corsConfig.origin === 'string') {
      headers['Access-Control-Allow-Origin'] = corsConfig.origin;
    } else if (Array.isArray(corsConfig.origin)) {
      if (corsConfig.origin.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
      }
    } else if (typeof corsConfig.origin === 'function') {
      if (corsConfig.origin(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
      }
    }
  }

  // Add other CORS headers
  if (corsConfig.methods) {
    headers['Access-Control-Allow-Methods'] = corsConfig.methods.join(', ');
  }
  if (corsConfig.allowedHeaders) {
    headers['Access-Control-Allow-Headers'] = corsConfig.allowedHeaders.join(', ');
  }
  if (corsConfig.exposedHeaders) {
    headers['Access-Control-Expose-Headers'] = corsConfig.exposedHeaders.join(', ');
  }
  if (corsConfig.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  if (corsConfig.maxAge) {
    headers['Access-Control-Max-Age'] = corsConfig.maxAge.toString();
  }

  return headers;
}

function getSecurityHeaders(config: SecurityConfig) {
  return {
    // Content Security Policy
    'Content-Security-Policy': Object.entries(config.csp?.directives || {})
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; '),

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Enable browser XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // HTTP Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

    // Permissions policy
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()',
    ].join(', '),
  };
}

// Specialized security configurations for different routes
export const apiSecurity = security({
  cors: {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

export const websocketSecurity = security({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

export const uploadSecurity = security({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['POST'],
    maxAge: 3600,
  },
  csp: {
    directives: {
      'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      'media-src': ["'self'", 'data:', 'blob:', 'https:'],
    },
  },
});
