// Chat module stub — will be reimplemented with Supabase Realtime.
// Original implementation used ioredis + socket.io.

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  createdAt: Date;
  lastActivity: Date;
  metadata?: Record<string, unknown>;
}

export async function createChatRoom(
  room: Omit<ChatRoom, 'id' | 'createdAt' | 'lastActivity'>
): Promise<ChatRoom> {
  console.warn('[CHAT STUB] createChatRoom called — not implemented');
  return { ...room, id: `room:stub`, createdAt: new Date(), lastActivity: new Date() };
}

export async function sendMessage(
  message: Omit<ChatMessage, 'id' | 'timestamp'>
): Promise<ChatMessage> {
  console.warn('[CHAT STUB] sendMessage called — not implemented');
  return { ...message, id: `msg:stub`, timestamp: new Date() };
}

export async function getRoomMessages(_roomId: string, _limit = 50): Promise<ChatMessage[]> {
  console.warn('[CHAT STUB] getRoomMessages called — not implemented');
  return [];
}

export async function getUserRooms(_userId: string): Promise<ChatRoom[]> {
  console.warn('[CHAT STUB] getUserRooms called — not implemented');
  return [];
}

export async function addUserToRoom(_userId: string, _roomId: string): Promise<boolean> {
  console.warn('[CHAT STUB] addUserToRoom called — not implemented');
  return false;
}

export async function removeUserFromRoom(_userId: string, _roomId: string): Promise<boolean> {
  console.warn('[CHAT STUB] removeUserFromRoom called — not implemented');
  return false;
}
