import { Redis } from '@upstash/redis';
import prisma from './prisma';

const redis = Redis.fromEnv();
const AUDIT_PREFIX = 'audit:';
const AUDIT_RETENTION = 60 * 60 * 24 * 90; // 90 days in seconds

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_CHANGE = 'EMAIL_CHANGE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  USER_CREATE = 'USER_CREATE',
  USER_DELETE = 'USER_DELETE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  SESSION_INVALIDATE = 'SESSION_INVALIDATE',
  FAILED_LOGIN = 'FAILED_LOGIN',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

export interface AuditLogEntry {
  timestamp: number;
  userId: string;
  action: AuditAction;
  details: Record<string, any>;
  ip: string;
  userAgent: string;
  success: boolean;
  sessionId?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  const auditKey = `${AUDIT_PREFIX}${entry.userId}:${Date.now()}`;
  
  // Store in Redis for quick access
  await redis.setex(auditKey, AUDIT_RETENTION, JSON.stringify(entry));

  // Store in database for permanent record
  await prisma.auditLog.create({
    data: {
      userId: entry.userId,
      action: entry.action,
      details: entry.details,
      ip: entry.ip,
      userAgent: entry.userAgent,
      success: entry.success,
      sessionId: entry.sessionId,
      timestamp: new Date(entry.timestamp),
    },
  });

  // If it's a security-sensitive action, trigger alerts
  if (isSensitiveAction(entry.action)) {
    await triggerSecurityAlert(entry);
  }
}

export async function getRecentAuditLogs(
  userId: string,
  limit: number = 50
): Promise<AuditLogEntry[]> {
  const pattern = `${AUDIT_PREFIX}${userId}:*`;
  const keys = await redis.keys(pattern);
  const logs: AuditLogEntry[] = [];

  // Sort keys by timestamp (descending)
  keys.sort((a, b) => parseInt(b.split(':')[2]) - parseInt(a.split(':')[2]));

  // Get the most recent logs
  for (const key of keys.slice(0, limit)) {
    const data = await redis.get(key);
    if (data) {
      logs.push(JSON.parse(data));
    }
  }

  return logs;
}

export async function getFailedLoginAttempts(
  userId: string,
  timeWindow: number = 3600000 // 1 hour in milliseconds
): Promise<number> {
  const now = Date.now();
  const logs = await getRecentAuditLogs(userId);
  
  return logs.filter(
    log =>
      log.action === AuditAction.FAILED_LOGIN &&
      now - log.timestamp < timeWindow
  ).length;
}

function isSensitiveAction(action: AuditAction): boolean {
  return [
    AuditAction.PASSWORD_CHANGE,
    AuditAction.PASSWORD_RESET,
    AuditAction.EMAIL_CHANGE,
    AuditAction.ROLE_CHANGE,
    AuditAction.USER_DELETE,
    AuditAction.PERMISSION_CHANGE,
    AuditAction.SUSPICIOUS_ACTIVITY,
  ].includes(action);
}

async function triggerSecurityAlert(entry: AuditLogEntry) {
  // Add to security monitoring queue
  await redis.lpush('security:alerts', JSON.stringify({
    ...entry,
    alertType: 'SENSITIVE_ACTION',
    severity: 'HIGH',
  }));
}
