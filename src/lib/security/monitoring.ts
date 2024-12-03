import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/api/logger';
import { ApiError } from '@/lib/api/errors';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  timestamp: string;
  ip?: string;
  userId?: string;
}

export class SecurityMonitor {
  private static readonly EVENT_KEY = 'security_events';
  private static readonly ALERT_THRESHOLD = 5;
  private static readonly ALERT_WINDOW = 300; // 5 minutes in seconds

  static async logEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Log to Redis for real-time monitoring
    await redis.lpush(
      this.EVENT_KEY,
      JSON.stringify(securityEvent)
    );

    // Trim the list to keep only recent events
    await redis.ltrim(this.EVENT_KEY, 0, 999);

    // Log to application logger
    logger.warn('Security event detected', securityEvent);

    // Check if we need to trigger alerts
    await this.checkAlertThreshold(securityEvent);
  }

  private static async checkAlertThreshold(event: SecurityEvent): Promise<void> {
    const recentEvents = await this.getRecentEvents(
      event.type,
      this.ALERT_WINDOW
    );

    if (recentEvents.length >= this.ALERT_THRESHOLD) {
      await this.triggerAlert(event.type, recentEvents);
    }
  }

  private static async getRecentEvents(
    type: string,
    windowSeconds: number
  ): Promise<SecurityEvent[]> {
    const events = await redis.lrange(this.EVENT_KEY, 0, -1);
    const now = Date.now();

    return events
      .map(event => JSON.parse(event))
      .filter(
        (event: SecurityEvent) =>
          event.type === type &&
          now - new Date(event.timestamp).getTime() <= windowSeconds * 1000
      );
  }

  private static async triggerAlert(
    type: string,
    events: SecurityEvent[]
  ): Promise<void> {
    const alert = {
      type: 'security_alert',
      message: `Security alert: Multiple ${type} events detected`,
      events,
      timestamp: new Date().toISOString(),
    };

    logger.error('Security alert triggered', alert);

    // Here you would typically:
    // 1. Send notifications (email, Slack, etc.)
    // 2. Create an incident ticket
    // 3. Trigger automated responses
  }

  // Monitor suspicious IP addresses
  static async monitorIp(ip: string): Promise<void> {
    const key = `suspicious_ip:${ip}`;
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 3600); // Expire after 1 hour
    }

    if (count > 100) { // Threshold for suspicious activity
      await this.logEvent({
        type: 'suspicious_ip',
        severity: 'high',
        message: 'Suspicious IP activity detected',
        details: { ip, requestCount: count },
        ip,
      });
    }
  }

  // Monitor failed authentication attempts
  static async monitorAuthFailure(
    ip: string,
    userId?: string
  ): Promise<void> {
    const key = `auth_failures:${ip}`;
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 900); // Expire after 15 minutes
    }

    if (count > 5) { // Threshold for suspicious auth failures
      await this.logEvent({
        type: 'auth_failure',
        severity: 'high',
        message: 'Multiple authentication failures detected',
        details: { ip, userId, failureCount: count },
        ip,
        userId,
      });
    }
  }

  // Monitor API usage patterns
  static async monitorApiUsage(
    req: NextRequest,
    res: NextResponse
  ): Promise<void> {
    const ip = req.ip ?? 'unknown';
    const method = req.method;
    const path = new URL(req.url).pathname;
    const status = res.status;

    // Monitor rate of 4xx and 5xx responses
    if (status >= 400) {
      const key = `error_responses:${ip}:${path}`;
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, 300); // Expire after 5 minutes
      }

      if (count > 10) { // Threshold for suspicious error rates
        await this.logEvent({
          type: 'high_error_rate',
          severity: 'medium',
          message: 'High rate of error responses detected',
          details: { ip, path, method, status, errorCount: count },
          ip,
        });
      }
    }
  }
}

// Middleware to monitor requests
export async function securityMonitoring(
  req: NextRequest,
  res: NextResponse
): Promise<void> {
  const ip = req.ip ?? 'unknown';

  // Monitor IP activity
  await SecurityMonitor.monitorIp(ip);

  // Monitor API usage
  await SecurityMonitor.monitorApiUsage(req, res);

  // Additional monitoring based on response status
  if (res.status === 401) {
    await SecurityMonitor.monitorAuthFailure(ip);
  }
}
