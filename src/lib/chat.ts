import { Redis } from 'ioredis';
import { getIO } from './socket';

const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!);

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  createdAt: Date;
  lastActivity: Date;
  metadata?: Record<string, any>;
}

export async function createChatRoom(room: Omit<ChatRoom, 'id' | 'createdAt' | 'lastActivity'>): Promise<ChatRoom> {
  const id = `room:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const fullRoom: ChatRoom = {
    ...room,
    id,
    createdAt: new Date(),
    lastActivity: new Date(),
  };

  await redis.setex(
    `chatroom:${id}`,
    60 * 60 * 24 * 30, // 30 days
    JSON.stringify(fullRoom)
  );

  // Add participants to room
  for (const userId of room.participants) {
    await redis.sadd(`user:${userId}:rooms`, id);
  }

  return fullRoom;
}

export async function sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
  const id = `msg:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const fullMessage: ChatMessage = {
    ...message,
    id,
    timestamp: new Date(),
  };

  // Store message in Redis
  await redis.lpush(
    `chatroom:${message.roomId}:messages`,
    JSON.stringify(fullMessage)
  );
  await redis.ltrim(`chatroom:${message.roomId}:messages`, 0, 99); // Keep last 100 messages

  // Update room's last activity
  const roomData = await redis.get(`chatroom:${message.roomId}`);
  if (roomData) {
    const room = JSON.parse(roomData) as ChatRoom;
    room.lastActivity = new Date();
    await redis.setex(
      `chatroom:${message.roomId}`,
      60 * 60 * 24 * 30, // 30 days
      JSON.stringify(room)
    );
  }

  // Send real-time message
  const io = getIO();
  io.to(message.roomId).emit('chatMessage', fullMessage);

  return fullMessage;
}

export async function getRoomMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
  const messages = await redis.lrange(`chatroom:${roomId}:messages`, 0, limit - 1);
  return messages.map(msg => JSON.parse(msg));
}

export async function getUserRooms(userId: string): Promise<ChatRoom[]> {
  const roomIds = await redis.smembers(`user:${userId}:rooms`);
  const rooms: ChatRoom[] = [];

  for (const roomId of roomIds) {
    const data = await redis.get(`chatroom:${roomId}`);
    if (data) {
      rooms.push(JSON.parse(data));
    }
  }

  return rooms.sort((a, b) => 
    new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );
}

export async function addUserToRoom(userId: string, roomId: string): Promise<boolean> {
  const roomData = await redis.get(`chatroom:${roomId}`);
  if (!roomData) return false;

  const room = JSON.parse(roomData) as ChatRoom;
  if (!room.participants.includes(userId)) {
    room.participants.push(userId);
    await redis.setex(
      `chatroom:${roomId}`,
      60 * 60 * 24 * 30, // 30 days
      JSON.stringify(room)
    );
    await redis.sadd(`user:${userId}:rooms`, roomId);
  }

  return true;
}

export async function removeUserFromRoom(userId: string, roomId: string): Promise<boolean> {
  const roomData = await redis.get(`chatroom:${roomId}`);
  if (!roomData) return false;

  const room = JSON.parse(roomData) as ChatRoom;
  room.participants = room.participants.filter(id => id !== userId);
  
  await redis.setex(
    `chatroom:${roomId}`,
    60 * 60 * 24 * 30, // 30 days
    JSON.stringify(room)
  );
  await redis.srem(`user:${userId}:rooms`, roomId);

  return true;
}
