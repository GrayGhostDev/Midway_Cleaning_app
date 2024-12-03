import { Redis } from '@upstash/redis';
import prisma from './prisma';
import { clerkClient } from '@clerk/nextjs';
import { Resend } from 'resend';

const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

interface SecurityMetrics {
  totalFailedLogins: number;
  uniqueFailedIPs: number;
  accountLockouts: number;
  suspiciousActivities: number;
  mfaEnrollment: number;
}

export async function generateSecurityReport(): Promise<SecurityMetrics> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Get all users
  const users = await clerkClient.users.getUserList();

  // Calculate MFA enrollment rate
  const mfaEnabledUsers = users.filter(user => 
    user.twoFactorEnabled
  ).length;

  const mfaEnrollment = (mfaEnabledUsers / users.length) * 100;

  // Get security metrics from database
  const [failedLogins, accountLockouts, suspiciousActivities] = await Promise.all([
    prisma.auditLog.count({
      where: {
        action: 'FAILED_LOGIN',
        timestamp: { gte: dayAgo },
      },
    }),
    prisma.auditLog.count({
      where: {
        action: 'ACCOUNT_LOCKOUT',
        timestamp: { gte: dayAgo },
      },
    }),
    prisma.securityAlert.count({
      where: {
        type: 'SUSPICIOUS_ACTIVITY',
        timestamp: { gte: dayAgo },
      },
    }),
  ]);

  // Get unique failed IPs from Redis
  const failedIPs = await redis.keys('ip:*:failed_attempts');

  return {
    totalFailedLogins: failedLogins,
    uniqueFailedIPs: failedIPs.length,
    accountLockouts,
    suspiciousActivities,
    mfaEnrollment,
  };
}

export async function sendDailySecurityReport(adminEmail: string) {
  const metrics = await generateSecurityReport();
  
  const reportHtml = `
    <h2>Daily Security Report</h2>
    <p>Here are the security metrics for the last 24 hours:</p>
    <ul>
      <li>Failed Login Attempts: ${metrics.totalFailedLogins}</li>
      <li>Unique IPs with Failed Attempts: ${metrics.uniqueFailedIPs}</li>
      <li>Account Lockouts: ${metrics.accountLockouts}</li>
      <li>Suspicious Activities: ${metrics.suspiciousActivities}</li>
      <li>MFA Enrollment Rate: ${metrics.mfaEnrollment.toFixed(2)}%</li>
    </ul>
  `;

  await resend.emails.send({
    from: 'security@midwaycleaning.com',
    to: adminEmail,
    subject: 'Daily Security Report - Midway Cleaning',
    html: reportHtml,
  });
}

export async function scheduleDailySecurityReports() {
  // Schedule report to run daily at midnight
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const delay = midnight.getTime() - Date.now();
  
  setTimeout(async () => {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    
    for (const email of adminEmails) {
      await sendDailySecurityReport(email.trim());
    }

    // Schedule next report
    scheduleDailySecurityReports();
  }, delay);
}

export async function generateSecurityAlert(
  type: string,
  severity: string,
  details: any
) {
  await prisma.securityAlert.create({
    data: {
      type,
      severity,
      details,
      timestamp: new Date(),
    },
  });

  // For high-severity alerts, send immediate notification
  if (severity === 'HIGH' || severity === 'CRITICAL') {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    
    for (const email of adminEmails) {
      await resend.emails.send({
        from: 'security@midwaycleaning.com',
        to: email.trim(),
        subject: `🚨 Security Alert: ${type}`,
        html: `
          <h2>Security Alert</h2>
          <p>Type: ${type}</p>
          <p>Severity: ${severity}</p>
          <p>Details: ${JSON.stringify(details, null, 2)}</p>
        `,
      });
    }
  }
}
