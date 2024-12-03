import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { security, apiSecurity, websocketSecurity, uploadSecurity } from './security';
import { rateLimit, apiRateLimit, authRateLimit, uploadRateLimit, websocketRateLimit } from './rate-limit';
import { validate } from './validate';
import { upload, imageUpload, documentUpload, avatarUpload } from './upload';

type Middleware = (req: NextRequest) => Promise<NextResponse> | NextResponse;

// Compose multiple middleware functions into a single middleware
export function compose(...middlewares: Middleware[]) {
  return async (req: NextRequest) => {
    let response = NextResponse.next();

    for (const middleware of middlewares) {
      try {
        response = await middleware(req);
        
        // If middleware returns a response with error status, break the chain
        if (response.status >= 400) {
          return response;
        }
      } catch (error) {
        console.error('Middleware error:', error);
        return new NextResponse(
          JSON.stringify({
            error: 'Internal Server Error',
            message: 'An error occurred while processing the request',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    return response;
  };
}

// Create specialized middleware chains for different routes
export const apiMiddleware = compose(
  apiSecurity,
  apiRateLimit
);

export const authMiddleware = compose(
  security(),
  authRateLimit
);

export const uploadMiddleware = compose(
  uploadSecurity,
  uploadRateLimit,
  upload()
);

export const websocketMiddleware = compose(
  websocketSecurity,
  websocketRateLimit
);

export const imageUploadMiddleware = compose(
  uploadSecurity,
  uploadRateLimit,
  imageUpload
);

export const documentUploadMiddleware = compose(
  uploadSecurity,
  uploadRateLimit,
  documentUpload
);

export const avatarUploadMiddleware = compose(
  uploadSecurity,
  uploadRateLimit,
  avatarUpload
);

// Export individual middleware for custom composition
export {
  security,
  apiSecurity,
  websocketSecurity,
  uploadSecurity,
  rateLimit,
  apiRateLimit,
  authRateLimit,
  uploadRateLimit,
  websocketRateLimit,
  validate,
  upload,
  imageUpload,
  documentUpload,
  avatarUpload,
};
