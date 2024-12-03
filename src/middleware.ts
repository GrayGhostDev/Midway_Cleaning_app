import { authMiddleware, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { compose } from './middleware/index';
import { enhancedSecurity } from './middleware/security-config';

const redis = Redis.fromEnv();

const LOCKOUT_THRESHOLD = 5; // Number of failed attempts before lockout
const LOCKOUT_DURATION = 15 * 60; // 15 minutes in seconds
const SESSION_TIMEOUT = 30 * 60; // 30 minutes in seconds
const SUSPICIOUS_IP_THRESHOLD = 10; // Number of requests before marking IP as suspicious

const WHITELISTED_IPS = process.env.WHITELISTED_IPS ? process.env.WHITELISTED_IPS.split(',') : [];
const BLACKLISTED_IPS = process.env.BLACKLISTED_IPS ? process.env.BLACKLISTED_IPS.split(',') : [];

async function checkIpSecurity(ip: string): Promise<boolean> {
  if (BLACKLISTED_IPS.includes(ip)) return false;
  if (WHITELISTED_IPS.includes(ip)) return true;

  const requestCount = await redis.incr(`ip:${ip}:requests`);
  await redis.expire(`ip:${ip}:requests`, 3600); // Reset after 1 hour

  if (requestCount > SUSPICIOUS_IP_THRESHOLD) {
    await redis.setex(`ip:${ip}:suspicious`, 86400, '1'); // Mark as suspicious for 24 hours
    return false;
  }

  return true;
}

async function checkAccountLockout(userId: string): Promise<boolean> {
  const failedAttempts = await redis.get(`user:${userId}:failed_attempts`);
  if (failedAttempts && parseInt(failedAttempts) >= LOCKOUT_THRESHOLD) {
    return true;
  }
  return false;
}

async function updateSessionActivity(sessionId: string): Promise<void> {
  await redis.setex(`session:${sessionId}:lastActivity`, SESSION_TIMEOUT, Date.now().toString());
}

async function checkSessionTimeout(sessionId: string): Promise<boolean> {
  const lastActivity = await redis.get(`session:${sessionId}:lastActivity`);
  if (!lastActivity) return true;

  const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
  return timeSinceLastActivity > SESSION_TIMEOUT * 1000;
}

// Compose auth middleware with enhanced security
export default compose(
  enhancedSecurity,
  authMiddleware({
    async beforeAuth(req) {
      const ip = req.ip ?? 'unknown';
      
      // Check IP-based security rules
      if (!(await checkIpSecurity(ip))) {
        return new NextResponse('Access Denied', { status: 403 });
      }

      return NextResponse.next();
    },

    async afterAuth(auth, req) {
      if (!auth.userId) return NextResponse.next();

      const sessionId = auth.sessionId;
      
      // Check account lockout
      if (await checkAccountLockout(auth.userId)) {
        return new NextResponse('Account Locked', { status: 423 });
      }

      // Check session timeout
      if (sessionId && await checkSessionTimeout(sessionId)) {
        await clerkClient.sessions.revokeSession(sessionId);
        return new NextResponse('Session Expired', { status: 440 });
      }

      // Update session activity
      if (sessionId) {
        await updateSessionActivity(sessionId);
      }

      return NextResponse.next();
    },
  })
);

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
