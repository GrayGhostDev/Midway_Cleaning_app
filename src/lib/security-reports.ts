// Security reports stub -- dependencies (resend, prisma.auditLog) not available.
// Will be implemented with Supabase queries when migration completes.

interface SecurityMetrics {
  totalFailedLogins: number;
  uniqueFailedIPs: number;
  accountLockouts: number;
  suspiciousActivities: number;
  mfaEnrollment: number;
}

export async function generateSecurityReport(): Promise<SecurityMetrics> {
  console.log('[SECURITY-REPORTS] generateSecurityReport stub');
  return {
    totalFailedLogins: 0,
    uniqueFailedIPs: 0,
    accountLockouts: 0,
    suspiciousActivities: 0,
    mfaEnrollment: 0,
  };
}

export async function sendDailySecurityReport(_adminEmail: string) {
  console.log('[SECURITY-REPORTS] sendDailySecurityReport stub');
}

export async function scheduleDailySecurityReports() {
  console.log('[SECURITY-REPORTS] scheduleDailySecurityReports stub');
}

export async function generateSecurityAlert(
  type: string,
  severity: string,
  details: unknown
) {
  console.log('[SECURITY-REPORTS] generateSecurityAlert:', { type, severity, details });
}
