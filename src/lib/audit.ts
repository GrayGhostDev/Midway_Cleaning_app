// Audit logging stub -- prisma.auditLog is not available yet.
// Will be replaced with Supabase audit table when migration completes.

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
  details: Record<string, unknown>;
  ip: string;
  userAgent: string;
  success: boolean;
  sessionId?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  // Log to console until Supabase audit table is ready
  console.log('[AUDIT]', {
    action: entry.action,
    userId: entry.userId,
    success: entry.success,
    ip: entry.ip,
    timestamp: new Date(entry.timestamp).toISOString(),
  });

  if (isSensitiveAction(entry.action)) {
    console.warn('[AUDIT] Sensitive action detected:', entry.action);
  }
}

export async function getRecentAuditLogs(
  userId: string,
  _limit: number = 50
): Promise<AuditLogEntry[]> {
  console.log('[AUDIT] getRecentAuditLogs called for:', userId);
  return [];
}

export async function getFailedLoginAttempts(
  userId: string,
  _timeWindow: number = 3600000
): Promise<number> {
  console.log('[AUDIT] getFailedLoginAttempts called for:', userId);
  return 0;
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
