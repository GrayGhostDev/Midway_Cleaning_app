import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import Redis from 'ioredis';
import { auth } from '@clerk/nextjs';
import { prisma } from '../../lib/prisma.js';
import pkg from 'limiter';
const { RateLimiter } = pkg;

// Initialize Redis clients
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const redisSub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Rate limiter: 100 messages per minute
const messageLimiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 'minute',
});

interface ServiceUpdate {
  id: string;
  status: string;
  progress: number;
  eta: string;
  location: string;
  cleaner: string;
  notes?: string;
}

interface ChatMessage {
  roomId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Error handling utility
const handleError = (socket: Socket, error: Error) => {
  console.error('WebSocket error:', error);
  socket.emit('error', {
    message: 'An error occurred',
    code: error.name,
    timestamp: new Date().toISOString(),
  });
};

// Redis pub/sub channels
const CHANNELS = {
  SERVICE_UPDATES: 'service:updates',
  CHAT_MESSAGES: 'chat:messages',
  NOTIFICATIONS: 'notifications',
};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      // Verify token with Clerk
      const { userId } = auth();
      if (!userId) {
        return next(new Error('Invalid token'));
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, name: true },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // Subscribe to Redis channels
  redisSub.subscribe(
    CHANNELS.SERVICE_UPDATES,
    CHANNELS.CHAT_MESSAGES,
    CHANNELS.NOTIFICATIONS,
    (err) => {
      if (err) {
        console.error('Redis subscription error:', err);
        return;
      }
      console.log('Subscribed to Redis channels');
    }
  );

  // Handle Redis messages
  redisSub.on('message', (channel, message) => {
    try {
      const data = JSON.parse(message);
      switch (channel) {
        case CHANNELS.SERVICE_UPDATES:
          io.to(`service:${data.id}`).emit('serviceUpdate', data);
          break;
        case CHANNELS.CHAT_MESSAGES:
          io.to(`chat:${data.roomId}`).emit('chatMessage', data);
          break;
        case CHANNELS.NOTIFICATIONS:
          io.to(`user:${data.userId}`).emit('notification', data);
          break;
      }
    } catch (error) {
      console.error('Redis message handling error:', error);
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.data.user.id);

    // Join user's personal room
    socket.join(`user:${socket.data.user.id}`);

    // Handle room joining
    socket.on('join', async (rooms: string[]) => {
      try {
        // Validate room access
        const validRooms = await validateRoomAccess(socket.data.user.id, rooms);
        validRooms.forEach(room => socket.join(room));
        socket.emit('joinedRooms', validRooms);
      } catch (error) {
        handleError(socket, error as Error);
      }
    });

    // Handle service updates
    socket.on('updateService', async (data: ServiceUpdate) => {
      try {
        // Validate update permission
        await validateServiceUpdatePermission(socket.data.user.id, data.id);
        
        // Publish update to Redis
        await redis.publish(
          CHANNELS.SERVICE_UPDATES,
          JSON.stringify({
            ...data,
            updatedAt: new Date().toISOString(),
          })
        );

        // Store update in database
        await prisma.booking.update({
          where: { id: data.id },
          data: {
            status: data.status as any,
            notes: data.notes,
          },
        });
      } catch (error) {
        handleError(socket, error as Error);
      }
    });

    // Handle chat messages
    socket.on('sendMessage', async (data: Omit<ChatMessage, 'timestamp' | 'senderId' | 'senderName'>) => {
      try {
        // Check rate limit
        if (!await messageLimiter.tryRemoveTokens(1)) {
          throw new Error('Rate limit exceeded');
        }

        const message: ChatMessage = {
          ...data,
          senderId: socket.data.user.id,
          senderName: socket.data.user.name || 'Anonymous',
          timestamp: new Date().toISOString(),
        };

        // Publish message to Redis
        await redis.publish(CHANNELS.CHAT_MESSAGES, JSON.stringify(message));

        // Store message in database
        await prisma.notification.create({
          data: {
            title: 'New Message',
            message: message.message,
            userId: message.senderId,
            bookingId: message.roomId.startsWith('booking:') ? message.roomId.split(':')[1] : undefined,
          },
        });
      } catch (error) {
        handleError(socket, error as Error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.data.user.id);
    });

    // Handle errors
    socket.on('error', (error) => {
      handleError(socket, error);
    });
  });

  const PORT = process.env.WEBSOCKET_PORT || 3001;
  server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
  });
});

// Utility functions
async function validateRoomAccess(userId: string, rooms: string[]): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: true,
      cleanerBookings: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return rooms.filter(room => {
    const [type, id] = room.split(':');
    
    switch (type) {
      case 'service':
      case 'booking':
        return user.bookings.some(b => b.id === id) || 
               user.cleanerBookings.some(b => b.id === id) ||
               user.role === 'ADMIN';
      case 'chat':
        return true; // Add additional chat room validation if needed
      default:
        return false;
    }
  });
}

async function validateServiceUpdatePermission(userId: string, serviceId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Admins and managers can update any service
  if (['ADMIN', 'MANAGER'].includes(user.role)) {
    return true;
  }

  // Cleaners can only update their assigned services
  const booking = await prisma.booking.findFirst({
    where: {
      id: serviceId,
      cleanerId: userId,
    },
  });

  if (!booking) {
    throw new Error('Not authorized to update this service');
  }

  return true;
}
