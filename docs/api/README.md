# API Documentation

## Overview
The Midway Cleaning Dashboard API is built using Next.js API routes with TypeScript and includes real-time WebSocket functionality. This documentation covers all available endpoints, authentication requirements, security features, and example requests/responses.

## Authentication
Authentication is handled by Clerk. Include the authentication token in the Authorization header:

```http
Authorization: Bearer <your-token>
```

## Security Features

### Rate Limiting
- API requests are limited per IP and user
- Default limits:
  - 100 requests per minute for authenticated users
  - 20 requests per minute for unauthenticated users
  - 50 WebSocket connections per IP
  - 10 file uploads per minute

### Request Validation
All endpoints implement:
- Input validation using Zod schemas
- Type checking
- Input sanitization
- XSS protection

### File Upload Security
- Maximum file size: 10MB (configurable)
- Allowed file types: images, documents
- Malware scanning
- Secure filename generation

### IP Security
- IP-based rate limiting
- Whitelist/blacklist support
- Suspicious activity monitoring
- DDoS protection

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## REST Endpoints

### Authentication

#### POST /auth/login
Authenticate a user and receive a session token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

### Customers

#### GET /customers
Retrieve a list of customers with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for customer name/email

**Response:**
```json
{
  "customers": [
    {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## WebSocket API

### Connection
Connect to the WebSocket server:

```javascript
const socket = io('wss://your-domain.com', {
  auth: {
    token: 'your-auth-token'
  }
});
```

### Events

#### Service Updates
```typescript
// Subscribe to service updates
socket.on('service:update', (data: {
  serviceId: string;
  status: 'started' | 'in-progress' | 'completed';
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}) => {
  // Handle service update
});

// Emit service update
socket.emit('service:update', {
  serviceId: '123',
  status: 'in-progress',
  timestamp: '2024-01-01T10:00:00Z'
});
```

#### Chat Messages
```typescript
// Subscribe to chat messages
socket.on('chat:message', (data: {
  messageId: string;
  from: string;
  content: string;
  timestamp: string;
}) => {
  // Handle chat message
});

// Send chat message
socket.emit('chat:message', {
  to: 'user-123',
  content: 'Hello!',
  timestamp: '2024-01-01T10:00:00Z'
});
```

#### Notifications
```typescript
// Subscribe to notifications
socket.on('notification', (data: {
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}) => {
  // Handle notification
});
```

### Error Handling

#### WebSocket Errors
```typescript
socket.on('error', (error: {
  code: string;
  message: string;
}) => {
  // Handle error
});
```

### Connection Management
```typescript
// Handle reconnection
socket.on('reconnect', (attemptNumber: number) => {
  // Handle reconnection
});

// Handle disconnection
socket.on('disconnect', (reason: string) => {
  // Handle disconnection
});
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "timestamp": "2024-01-01T10:00:00Z"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Authentication required or failed
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `FILE_UPLOAD_ERROR`: File upload failed
- `INTERNAL_ERROR`: Server error

## Security Best Practices

### Client-Side
1. Always use HTTPS
2. Implement token refresh mechanism
3. Validate WebSocket server certificate
4. Handle reconnection gracefully
5. Implement client-side rate limiting

### Server-Side
1. Input validation
2. Rate limiting
3. IP-based protection
4. File upload validation
5. WebSocket authentication
6. Request sanitization

## Data Models

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
```

### Service
```typescript
interface Service {
  id: string;
  customerId: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  services: string[];
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Versioning
API versioning follows semantic versioning (MAJOR.MINOR.PATCH).
Breaking changes will be introduced in new API versions.

## Support
For API support or questions:
- Email: api-support@midwaycleaning.com
- Documentation: https://docs.midwaycleaning.com
- Status: https://status.midwaycleaning.com
