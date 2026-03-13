import { NextResponse } from 'next/server';
import { addSecurityHeaders, addCorsHeaders, corsConfig } from '../headers';

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test-nonce-123'),
}));

// Mock NextResponse
jest.mock('next/server', () => {
  const headers = new Map<string, string>();
  return {
    NextResponse: {
      next: jest.fn(() => ({
        headers: {
          set: jest.fn((key: string, value: string) => headers.set(key, value)),
          get: jest.fn((key: string) => headers.get(key)),
        },
      })),
    },
  };
});

describe('Security Headers', () => {
  let mockResponse: any;

  beforeEach(() => {
    mockResponse = NextResponse.next();
    jest.clearAllMocks();
  });

  describe('addSecurityHeaders', () => {
    it('should set Content-Security-Policy header', () => {
      addSecurityHeaders(mockResponse);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.stringContaining("default-src 'self'")
      );
    });

    it('should include nonce in CSP', () => {
      const { nonce } = addSecurityHeaders(mockResponse);

      expect(nonce).toBe('test-nonce-123');
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.stringContaining('nonce-test-nonce-123')
      );
    });

    it('should set Strict-Transport-Security header', () => {
      addSecurityHeaders(mockResponse);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    });

    it('should set X-Frame-Options to DENY', () => {
      addSecurityHeaders(mockResponse);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-Frame-Options',
        'DENY'
      );
    });

    it('should set X-Content-Type-Options to nosniff', () => {
      addSecurityHeaders(mockResponse);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-Content-Type-Options',
        'nosniff'
      );
    });

    it('should set Referrer-Policy', () => {
      addSecurityHeaders(mockResponse);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Referrer-Policy',
        'strict-origin-when-cross-origin'
      );
    });

    it('should set Permissions-Policy', () => {
      addSecurityHeaders(mockResponse);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Permissions-Policy',
        expect.stringContaining('camera=()')
      );
    });

    it('should set additional security headers', () => {
      addSecurityHeaders(mockResponse);

      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-DNS-Prefetch-Control', 'off');
      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-Download-Options', 'noopen');
      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-Permitted-Cross-Domain-Policies', 'none');
    });

    it('should respect disabled config options', () => {
      addSecurityHeaders(mockResponse, {
        contentSecurityPolicy: false,
        strictTransportSecurity: false,
        xFrameOptions: true,
        xContentTypeOptions: true,
        referrerPolicy: true,
        permissionsPolicy: true,
      });

      expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.anything()
      );
      expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
        'Strict-Transport-Security',
        expect.anything()
      );
    });
  });

  describe('addCorsHeaders', () => {
    it('should set CORS headers for allowed origin', () => {
      addCorsHeaders(mockResponse, 'http://localhost:3000');

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000'
      );
    });

    it('should set allowed methods', () => {
      addCorsHeaders(mockResponse, 'http://localhost:3000');

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
    });

    it('should set allowed headers', () => {
      addCorsHeaders(mockResponse, 'http://localhost:3000');

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Headers',
        expect.stringContaining('Content-Type')
      );
    });

    it('should set credentials header', () => {
      addCorsHeaders(mockResponse, 'http://localhost:3000');

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Credentials',
        'true'
      );
    });

    it('should not set CORS headers for disallowed origin', () => {
      addCorsHeaders(mockResponse, 'https://evil.com');

      expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        expect.anything()
      );
    });
  });

  describe('corsConfig', () => {
    it('should have localhost as default allowed origin', () => {
      expect(corsConfig.allowedOrigins).toContain('http://localhost:3000');
    });

    it('should allow standard HTTP methods', () => {
      expect(corsConfig.allowedMethods).toContain('GET');
      expect(corsConfig.allowedMethods).toContain('POST');
      expect(corsConfig.allowedMethods).toContain('PUT');
      expect(corsConfig.allowedMethods).toContain('DELETE');
    });

    it('should set 24-hour max age', () => {
      expect(corsConfig.maxAge).toBe(86400);
    });
  });
});
