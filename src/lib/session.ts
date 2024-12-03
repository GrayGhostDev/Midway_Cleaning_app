import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

const redis = Redis.fromEnv();
const SESSION_PREFIX = 'session:';
const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

export interface SessionData {
  userId: string;
  deviceInfo: {
    userAgent: string;
    ip: string;
  };
  lastActive: number;
  isActive: boolean;
}

export async function createSession(
  userId: string,
  deviceInfo: SessionData['deviceInfo']
): Promise<string> {
  const sessionId = `${SESSION_PREFIX}${userId}:${Date.now()}`;
  const sessionData: SessionData = {
    userId,
    deviceInfo,
    lastActive: Date.now(),
    isActive: true,
  };

  await redis.setex(sessionId, SESSION_EXPIRY, JSON.stringify(sessionData));
  return sessionId;
}

export async function getActiveSessions(userId: string): Promise<SessionData[]> {
  const pattern = `${SESSION_PREFIX}${userId}:*`;
  const keys = await redis.keys(pattern);
  const sessions: SessionData[] = [];

  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const session = JSON.parse(data) as SessionData;
      if (session.isActive) {
        sessions.push(session);
      }
    }
  }

  return sessions;
}

export async function invalidateSession(sessionId: string): Promise<boolean> {
  const session = await redis.get(sessionId);
  if (!session) return false;

  const sessionData = JSON.parse(session) as SessionData;
  sessionData.isActive = false;
  await redis.setex(sessionId, SESSION_EXPIRY, JSON.stringify(sessionData));
  return true;
}

export async function invalidateAllSessions(userId: string): Promise<number> {
  const pattern = `${SESSION_PREFIX}${userId}:*`;
  const keys = await redis.keys(pattern);
  let count = 0;

  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const session = JSON.parse(data) as SessionData;
      session.isActive = false;
      await redis.setex(key, SESSION_EXPIRY, JSON.stringify(session));
      count++;
    }
  }

  return count;
}

export async function updateSessionActivity(sessionId: string): Promise<boolean> {
  const session = await redis.get(sessionId);
  if (!session) return false;

  const sessionData = JSON.parse(session) as SessionData;
  sessionData.lastActive = Date.now();
  await redis.setex(sessionId, SESSION_EXPIRY, JSON.stringify(sessionData));
  return true;
}

export async function validateSession(sessionId: string): Promise<boolean> {
  const session = await redis.get(sessionId);
  if (!session) return false;

  const sessionData = JSON.parse(session) as SessionData;
  return sessionData.isActive;
}

export async function getCurrentSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const activeSessions = await getActiveSessions(session.user.id);
  return activeSessions[0] || null;
}
