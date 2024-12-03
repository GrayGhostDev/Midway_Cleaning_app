import { createLogger } from './logger';
import { monitorPerformance } from './sentry';

const logger = createLogger('Performance');

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]>;

  private constructor() {
    this.metrics = new Map();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  measureDuration(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);

    // Log if duration exceeds threshold
    if (duration > 1000) {
      logger.warn('Performance threshold exceeded', {
        metric: name,
        duration,
        threshold: 1000,
      });
    }
  }

  getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(values.length * 0.95)];
    const p99 = sorted[Math.floor(values.length * 0.99)];

    return {
      count: values.length,
      avg,
      min: sorted[0],
      max: sorted[values.length - 1],
      p95,
      p99,
    };
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const measurePerformance = async <T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> => {
  return monitorPerformance(name, operation);
};

export const reportWebVitals = ({
  id,
  name,
  label,
  value,
}: {
  id: string;
  name: string;
  label: string;
  value: number;
}) => {
  logger.info('Web Vital', {
    metric: name,
    id,
    label,
    value,
  });

  // Track Core Web Vitals
  if (name === 'FCP' || name === 'LCP' || name === 'CLS' || name === 'FID') {
    PerformanceMonitor.getInstance().measureDuration(name, value);
  }
};

// Memory monitoring
export const monitorMemoryUsage = () => {
  if (typeof process !== 'undefined') {
    const usage = process.memoryUsage();
    logger.info('Memory Usage', {
      heapUsed: usage.heapUsed / 1024 / 1024,
      heapTotal: usage.heapTotal / 1024 / 1024,
      rss: usage.rss / 1024 / 1024,
      external: usage.external / 1024 / 1024,
    });
  }
};
