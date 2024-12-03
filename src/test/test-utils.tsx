import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WebSocketProvider } from '@/contexts/websocket-context';

// Mock WebSocket class
class MockWebSocket {
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((data: any) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  readyState = WebSocket.CONNECTING;
  
  constructor(url: string, protocols?: string | string[]) {}
  
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {}
  close(code?: number, reason?: string) {}
}

// Mock storage service
export const mockStorageService = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
  getFileUrl: jest.fn(),
};

// Mock email service
export const mockEmailService = {
  sendEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

// Custom render function
function render(
  ui: React.ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </QueryClientProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };

// Mock next/navigation
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock WebSocket
global.WebSocket = MockWebSocket as any;

// Helper to create mock responses
export const createMockApiResponse = (data: any) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  });
};

// Helper to wait for promises
export const waitForPromises = () => new Promise(setImmediate);

// WebSocket testing utilities
export class MockWebSocketServer {
  private clients: MockWebSocket[] = [];
  private messageHandlers: ((data: any) => void)[] = [];

  addClient(client: MockWebSocket) {
    this.clients.push(client);
    client.onopen?.();
  }

  removeClient(client: MockWebSocket) {
    const index = this.clients.indexOf(client);
    if (index > -1) {
      this.clients.splice(index, 1);
      client.onclose?.();
    }
  }

  broadcast(data: any) {
    this.clients.forEach(client => {
      client.onmessage?.({ data: JSON.stringify(data) });
    });
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
  }

  handleMessage(data: any) {
    this.messageHandlers.forEach(handler => handler(data));
  }
}

export const createMockWebSocketServer = () => {
  const server = new MockWebSocketServer();
  
  // Override the MockWebSocket implementation
  class TestWebSocket extends MockWebSocket {
    constructor(url: string, protocols?: string | string[]) {
      super(url, protocols);
      server.addClient(this);
    }

    send(data: any) {
      server.handleMessage(JSON.parse(data));
    }

    close() {
      server.removeClient(this);
    }
  }

  // Replace the global WebSocket
  global.WebSocket = TestWebSocket as any;

  return server;
};

// Helper to simulate WebSocket events
export const simulateWebSocketEvent = (
  eventType: 'open' | 'close' | 'message' | 'error',
  data?: any
) => {
  const event = new Event(eventType);
  if (data) {
    Object.defineProperty(event, 'data', { value: JSON.stringify(data) });
  }
  return event;
};

// Helper to wait for WebSocket connection
export const waitForWebSocket = () => new Promise<void>(resolve => {
  const checkConnection = () => {
    const ws = global.WebSocket as any;
    if (ws.OPEN) {
      resolve();
    } else {
      setTimeout(checkConnection, 50);
    }
  };
  checkConnection();
});

// Helper to create mock service updates
export const createMockServiceUpdate = (overrides = {}) => ({
  id: 'service_123',
  status: 'IN_PROGRESS',
  progress: 50,
  eta: new Date(Date.now() + 3600000).toISOString(),
  location: '123 Test St',
  cleaner: {
    id: 'cleaner_123',
    name: 'John Doe',
  },
  notes: 'Making good progress',
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to create mock chat messages
export const createMockChatMessage = (overrides = {}) => ({
  roomId: 'chat_123',
  senderId: 'user_123',
  senderName: 'John Doe',
  message: 'Hello!',
  timestamp: new Date().toISOString(),
  ...overrides,
});

// Helper to create mock notifications
export const createMockNotification = (overrides = {}) => ({
  id: 'notification_123',
  title: 'New Message',
  message: 'You have a new message',
  isRead: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});
