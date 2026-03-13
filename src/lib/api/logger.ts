// Console-based logger stub -- replaces pino dependency.
// Install pino + pino-pretty for structured logging when ready.

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const LEVELS: Record<string, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LEVELS[level] ?? 1;

function shouldLog(msgLevel: string) {
  return (LEVELS[msgLevel] ?? 0) >= currentLevel;
}

export const logger = {
  info(msgOrObj: any, msg?: any) {
    if (shouldLog('info')) console.info(msg ?? '', msgOrObj);
  },
  error(msgOrObj: any, msg?: any) {
    if (shouldLog('error')) console.error(msg ?? '', msgOrObj);
  },
  warn(msgOrObj: any, msg?: any) {
    if (shouldLog('warn')) console.warn(msg ?? '', msgOrObj);
  },
  debug(msgOrObj: any, msg?: any) {
    if (shouldLog('debug')) console.debug(msg ?? '', msgOrObj);
  },
  child(_context: Record<string, any>) {
    return logger;
  },
};

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
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
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
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]';
      }
      cache.add(value);
    }
    return value;
  });
};
