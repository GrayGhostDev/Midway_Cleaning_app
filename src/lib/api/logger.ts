import pino from 'pino';

const pinoConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o',
    },
  },
  base: {
    env: process.env.NODE_ENV,
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
    remove: true,
  },
};

export const logger = pino(pinoConfig);

// Request context logger
export class RequestLogger {
  private requestId: string;
  private startTime: number;

  constructor(requestId: string) {
    this.requestId = requestId;
    this.startTime = Date.now();
  }

  info(message: string, data?: any) {
    logger.info({ requestId: this.requestId, ...data }, message);
  }

  error(message: string, error?: any) {
    logger.error(
      {
        requestId: this.requestId,
        error: {
          message: error?.message,
          stack: error?.stack,
          ...error,
        },
      },
      message
    );
  }

  warn(message: string, data?: any) {
    logger.warn({ requestId: this.requestId, ...data }, message);
  }

  debug(message: string, data?: any) {
    logger.debug({ requestId: this.requestId, ...data }, message);
  }

  logRequest(req: any) {
    this.info('Incoming request', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
    });
  }

  logResponse(res: any) {
    const duration = Date.now() - this.startTime;
    this.info('Response sent', {
      statusCode: res.statusCode,
      duration,
    });
  }
}

// Create a child logger with additional context
export const createLogger = (context: Record<string, any>) => {
  return logger.child(context);
};

// Utility function to safely stringify objects for logging
export const safeStringify = (obj: any): string => {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]';
      }
      cache.add(value);
    }
    return value;
  });
};
