import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

interface SecurityHeadersConfig {
  contentSecurityPolicy?: boolean;
  strictTransportSecurity?: boolean;
  xFrameOptions?: boolean;
  xContentTypeOptions?: boolean;
  referrerPolicy?: boolean;
  permissionsPolicy?: boolean;
}

export function addSecurityHeaders(
  response: NextResponse,
  config: SecurityHeadersConfig = {
    contentSecurityPolicy: true,
    strictTransportSecurity: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true,
    permissionsPolicy: true,
  }
) {
  // Generate a unique nonce for CSP
  const nonce = nanoid();

  if (config.contentSecurityPolicy) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: 'nonce-" + nonce + "'",
        "style-src 'self' 'unsafe-inline' https:",
        "img-src 'self' data: https:",
        "font-src 'self' data: https:",
        "connect-src 'self' https:",
        "media-src 'self' https:",
        "object-src 'none'",
        "frame-src 'self' https:",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join('; ')
    );
  }

  if (config.strictTransportSecurity) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  if (config.xFrameOptions) {
    response.headers.set('X-Frame-Options', 'DENY');
  }

  if (config.xContentTypeOptions) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  if (config.referrerPolicy) {
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  if (config.permissionsPolicy) {
    response.headers.set(
      'Permissions-Policy',
      [
        'accelerometer=()',
        'camera=()',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'microphone=()',
        'payment=()',
        'usb=()',
      ].join(', ')
    );
  }

  // Additional security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  return { response, nonce };
}

export const corsConfig = {
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-API-Key',
    'X-Requested-With',
    'Accept',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Rate-Limit-Limit',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset',
  ],
  maxAge: 86400, // 24 hours
  credentials: true,
};

export function addCorsHeaders(
  response: NextResponse,
  origin: string
): NextResponse {
  if (corsConfig.allowedOrigins.includes(origin) || corsConfig.allowedOrigins.includes('*')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set(
      'Access-Control-Allow-Methods',
      corsConfig.allowedMethods.join(', ')
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      corsConfig.allowedHeaders.join(', ')
    );
    response.headers.set(
      'Access-Control-Expose-Headers',
      corsConfig.exposedHeaders.join(', ')
    );
    response.headers.set(
      'Access-Control-Max-Age',
      corsConfig.maxAge.toString()
    );

    if (corsConfig.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }

  return response;
}
