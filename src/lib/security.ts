import { Redis } from '@upstash/redis';
import { AuditLogEntry } from './audit';
import prisma from './prisma';

const redis = Redis.fromEnv();
const ALERT_RETENTION = 60 * 60 * 24 * 30; // 30 days in seconds

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertType {
  FAILED_LOGIN = 'FAILED_LOGIN',
  SUSPICIOUS_IP = 'SUSPICIOUS_IP',
  UNUSUAL_ACTIVITY = 'UNUSUAL_ACTIVITY',
  SENSITIVE_ACTION = 'SENSITIVE_ACTION',
  PERMISSION_VIOLATION = 'PERMISSION_VIOLATION',
  BRUTE_FORCE = 'BRUTE_FORCE',
}

export interface SecurityAlert {
  id: string;
  timestamp: number;
  type: AlertType;
  severity: AlertSeverity;
  userId: string;
  details: Record<string, any>;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: number;
}

export async function monitorSecurityAlerts() {
  while (true) {
    const alert = await redis.brpop('security:alerts', 0);
    if (alert) {
      const alertData = JSON.parse(alert[1]);
      await processSecurityAlert(alertData);
    }
  }
}

async function processSecurityAlert(data: AuditLogEntry & { alertType: AlertType; severity: AlertSeverity }) {
  const alert: SecurityAlert = {
    id: `alert:${Date.now()}:${data.userId}`,
    timestamp: Date.now(),
    type: data.alertType,
    severity: data.severity,
    userId: data.userId,
    details: {
      ...data.details,
      ip: data.ip,
      userAgent: data.userAgent,
      action: data.action,
    },
    resolved: false,
  };

  // Store alert in Redis for quick access
  await redis.setex(`security:alert:${alert.id}`, ALERT_RETENTION, JSON.stringify(alert));

  // Store in database for permanent record
  await prisma.securityAlert.create({
    data: {
      alertId: alert.id,
      userId: alert.userId,
      type: alert.type,
      severity: alert.severity,
      details: alert.details,
      timestamp: new Date(alert.timestamp),
    },
  });

  // Trigger notifications based on severity
  if (alert.severity === AlertSeverity.HIGH || alert.severity === AlertSeverity.CRITICAL) {
    await notifySecurityTeam(alert);
  }
}

export async function getActiveAlerts(
  severity?: AlertSeverity,
  limit: number = 50
): Promise<SecurityAlert[]> {
  const pattern = 'security:alert:*';
  const keys = await redis.keys(pattern);
  const alerts: SecurityAlert[] = [];

  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const alert = JSON.parse(data) as SecurityAlert;
      if (!alert.resolved && (!severity || alert.severity === severity)) {
        alerts.push(alert);
      }
    }
  }

  return alerts
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export async function resolveAlert(alertId: string, resolvedBy: string): Promise<boolean> {
  const key = `security:alert:${alertId}`;
  const data = await redis.get(key);
  
  if (!data) return false;

  const alert = JSON.parse(data) as SecurityAlert;
  alert.resolved = true;
  alert.resolvedBy = resolvedBy;
  alert.resolvedAt = Date.now();

  await redis.setex(key, ALERT_RETENTION, JSON.stringify(alert));
  
  await prisma.securityAlert.update({
    where: { alertId },
    data: {
      resolved: true,
      resolvedBy,
      resolvedAt: new Date(alert.resolvedAt),
    },
  });

  return true;
}

async function notifySecurityTeam(alert: SecurityAlert) {
  // Add notification logic here (e.g., email, Slack, etc.)
  console.log('Security Alert:', {
    type: alert.type,
    severity: alert.severity,
    userId: alert.userId,
    details: alert.details,
  });
}
