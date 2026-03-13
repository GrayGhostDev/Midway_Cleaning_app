// Security monitoring stub -- prisma.securityAlert is not available yet.
// Will be replaced with Supabase security table when migration completes.

import { AuditLogEntry } from './audit';

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
  details: Record<string, unknown>;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: number;
}

export async function monitorSecurityAlerts() {
  console.log('[SECURITY] monitorSecurityAlerts stub -- no-op');
}

export async function getActiveAlerts(
  _severity?: AlertSeverity,
  _limit: number = 50
): Promise<SecurityAlert[]> {
  return [];
}

export async function resolveAlert(_alertId: string, _resolvedBy: string): Promise<boolean> {
  console.log('[SECURITY] resolveAlert stub -- no-op');
  return true;
}
