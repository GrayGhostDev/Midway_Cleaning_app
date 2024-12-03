import { compose, security, apiSecurity, websocketSecurity, uploadSecurity } from './index';
import { rateLimit, apiRateLimit, authRateLimit, uploadRateLimit, websocketRateLimit } from './rate-limit';
import { validate } from './validate';
import { bookingValidation, paymentValidation, fileValidation } from './validate';
import { upload, imageUpload, documentUpload, avatarUpload } from './upload';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Security constants
const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
const TRUSTED_PROXIES = process.env.TRUSTED_PROXIES?.split(',') || ['127.0.0.1'];

// Enhanced security middleware with CSP and other headers
const enhancedSecurity = security({
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'https:', 'data:'],
      'connect-src': ["'self'", 'wss:', 'https:'],
      'frame-ancestors': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': [],
    },
  },
});

// Enhanced API security middleware
export const enhancedApiSecurity = compose(
  apiSecurity,
  apiRateLimit,
  async (req: NextRequest) => {
    // Check request size
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > MAX_REQUEST_SIZE) {
      return new NextResponse(
        JSON.stringify({
          error: 'Payload Too Large',
          message: `Request size exceeds maximum of ${MAX_REQUEST_SIZE / (1024 * 1024)}MB`,
        }),
        {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate Content-Type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        return new NextResponse(
          JSON.stringify({
            error: 'Invalid Content-Type',
            message: 'Content-Type must be application/json',
          }),
          {
            status: 415,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    return NextResponse.next();
  }
);

// Enhanced WebSocket security middleware
export const enhancedWebsocketSecurity = compose(
  websocketSecurity,
  websocketRateLimit,
  async (req: NextRequest) => {
    // Validate WebSocket upgrade
    const upgrade = req.headers.get('upgrade');
    if (!upgrade || upgrade.toLowerCase() !== 'websocket') {
      return new NextResponse(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid WebSocket upgrade request',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return NextResponse.next();
  }
);

// Enhanced upload security middleware
export const enhancedUploadSecurity = compose(
  uploadSecurity,
  uploadRateLimit,
  async (req: NextRequest) => {
    // Check upload size
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > MAX_UPLOAD_SIZE) {
      return new NextResponse(
        JSON.stringify({
          error: 'Payload Too Large',
          message: `Upload size exceeds maximum of ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB`,
        }),
        {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate multipart/form-data
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid Content-Type',
          message: 'Content-Type must be multipart/form-data',
        }),
        {
          status: 415,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return NextResponse.next();
  }
);

// Export specialized middleware chains
export const bookingApiMiddleware = compose(
  enhancedApiSecurity,
  bookingValidation.create
);

export const paymentApiMiddleware = compose(
  enhancedApiSecurity,
  paymentValidation.create
);

export const imageUploadMiddleware = compose(
  enhancedUploadSecurity,
  fileValidation.upload,
  imageUpload
);

export const documentUploadMiddleware = compose(
  enhancedUploadSecurity,
  fileValidation.upload,
  documentUpload
);

export const avatarUploadMiddleware = compose(
  enhancedUploadSecurity,
  fileValidation.upload,
  avatarUpload
);

// Export utility functions for custom middleware composition
export {
  compose,
  enhancedSecurity as security,
  validate,
  upload,
  imageUpload,
  documentUpload,
  avatarUpload,
};
