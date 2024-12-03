import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { auth } from '@clerk/nextjs';

const pubClient = new Redis(process.env.UPSTASH_REDIS_REST_URL!);
const subClient = pubClient.duplicate();

export interface ServerToClientEvents {
  statusUpdate: (status: string) => void;
  scheduleUpdate: (schedule: any) => void;
  notification: (notification: any) => void;
  chatMessage: (message: any) => void;
}

export interface ClientToServerEvents {
  updateStatus: (status: string) => void;
  updateSchedule: (schedule: any) => void;
  sendMessage: (message: any) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

let io: IOServer<ClientToServerEvents, ServerToClientEvents>;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new IOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
    adapter: createAdapter(pubClient, subClient),
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      // Verify token with Clerk
      const { userId } = auth();
      if (!userId) {
        return next(new Error('Authentication error'));
      }
      socket.data.userId = userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.data.userId}`);

    // Handle status updates
    socket.on('updateStatus', async (status) => {
      io.to(`user:${socket.data.userId}`).emit('statusUpdate', status);
    });

    // Handle schedule updates
    socket.on('updateSchedule', async (schedule) => {
      io.to(`user:${socket.data.userId}`).emit('scheduleUpdate', schedule);
    });

    // Handle chat messages
    socket.on('sendMessage', async (message) => {
      const roomId = message.roomId;
      io.to(roomId).emit('chatMessage', {
        ...message,
        userId: socket.data.userId,
        timestamp: new Date(),
      });
    });

    // Handle room management
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
