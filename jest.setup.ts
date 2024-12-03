import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock environment variables
process.env.UPSTASH_REDIS_REST_URL = 'redis://localhost:6379';
process.env.RESEND_API_KEY = 'test_api_key';
process.env.AWS_ACCESS_KEY_ID = 'test_access_key';
process.env.AWS_SECRET_ACCESS_KEY = 'test_secret_key';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_S3_BUCKET = 'test-bucket';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
  } as Response)
);

// Mock TextEncoder/TextDecoder for Node.js environment
Object.assign(global, { TextEncoder, TextDecoder });

// Mock Redis client
jest.mock('ioredis', () => {
  const Redis = require('ioredis-mock');
  return Redis;
});

// Mock AWS S3 client
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

// Mock Resend email client
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}));

// Mock Socket.IO
jest.mock('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

// Clean up after each test
beforeEach(() => {
  jest.clearAllMocks();
});
