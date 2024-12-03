import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export const initializeSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [nodeProfilingIntegration()],
    beforeSend(event) {
      // Sanitize sensitive data
      if (event.request?.cookies) {
        event.request.cookies = { redacted: '[Redacted]' };
      }
      return event;
    },
  });
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
};

export const captureMessage = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, { extra: context });
};

export const setUserContext = (user: { id: string; email: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Simple performance monitoring without transactions
export const monitorPerformance = (name: string, fn: () => Promise<any>) => {
  const startTime = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - startTime;
    Sentry.captureMessage(`Performance: ${name}`, {
      level: 'info',
      extra: { duration, name },
    });
  });
};
