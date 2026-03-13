// Monitoring logger stub -- pino and pino-sentry are not installed.
// Uses console-based logging as a stand-in.

import { captureException } from './sentry';

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string) {
    return `[${this.context}] ${message}`;
  }

  info(message: string, data?: Record<string, unknown>) {
    console.info(this.formatMessage(message), data ?? '');
  }

  error(message: string, error?: Error, data?: Record<string, unknown>) {
    if (error) {
      captureException(error, data);
    }
    console.error(this.formatMessage(message), error, data ?? '');
  }

  warn(message: string, data?: Record<string, unknown>) {
    console.warn(this.formatMessage(message), data ?? '');
  }

  debug(message: string, data?: Record<string, unknown>) {
    console.debug(this.formatMessage(message), data ?? '');
  }

  audit(action: string, user: string, details: Record<string, unknown>) {
    console.info(this.formatMessage('Audit Log'), {
      type: 'AUDIT',
      action,
      user,
      ...details,
      timestamp: new Date().toISOString(),
    });
  }
}

export const createLogger = (context: string) => new Logger(context);
