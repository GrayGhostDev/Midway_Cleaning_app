import pino from 'pino';
import { createWriteStream } from 'pino-sentry';
import { captureException } from './sentry';

const streams = [
  { stream: process.stdout },
  createWriteStream({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
    level: 'error',
  }),
];

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    redact: {
      paths: ['password', 'email', 'creditCard', 'ssn'],
      remove: true,
    },
  },
  pino.multistream(streams)
);

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string) {
    return `[${this.context}] ${message}`;
  }

  info(message: string, data?: Record<string, any>) {
    logger.info({ ...data }, this.formatMessage(message));
  }

  error(message: string, error?: Error, data?: Record<string, any>) {
    if (error) {
      captureException(error, data);
    }
    logger.error({ error, ...data }, this.formatMessage(message));
  }

  warn(message: string, data?: Record<string, any>) {
    logger.warn({ ...data }, this.formatMessage(message));
  }

  debug(message: string, data?: Record<string, any>) {
    logger.debug({ ...data }, this.formatMessage(message));
  }

  audit(action: string, user: string, details: Record<string, any>) {
    logger.info(
      {
        type: 'AUDIT',
        action,
        user,
        ...details,
        timestamp: new Date().toISOString(),
      },
      this.formatMessage('Audit Log')
    );
  }
}

export const createLogger = (context: string) => new Logger(context);
