import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/api/logger';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface PageLoadMetric {
  ttfb: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  url: string;
  userAgent: string;
  timestamp: number;
}

export class PerformanceMonitor {
  private static readonly METRIC_PREFIX = 'perf:';
  private static readonly RETENTION_DAYS = 30;

  // Record a generic performance metric
  static async recordMetric(metric: PerformanceMetric): Promise<void> {
    try {
      const key = `${this.METRIC_PREFIX}${metric.name}:${Date.now()}`;
      await redis.set(key, JSON.stringify(metric));
      await redis.expire(key, this.RETENTION_DAYS * 24 * 60 * 60);

      // Update aggregates
      await this.updateAggregates(metric);
    } catch (error) {
      logger.error('Error recording performance metric', { metric, error });
    }
  }

  // Record page load metrics
  static async recordPageLoad(metrics: PageLoadMetric): Promise<void> {
    try {
      const key = `${this.METRIC_PREFIX}pageload:${Date.now()}`;
      await redis.set(key, JSON.stringify(metrics));
      await redis.expire(key, this.RETENTION_DAYS * 24 * 60 * 60);

      // Record individual metrics for aggregation
      await Promise.all([
        this.recordMetric({
          name: 'ttfb',
          value: metrics.ttfb,
          timestamp: metrics.timestamp,
          tags: { url: metrics.url },
        }),
        this.recordMetric({
          name: 'fcp',
          value: metrics.fcp,
          timestamp: metrics.timestamp,
          tags: { url: metrics.url },
        }),
        this.recordMetric({
          name: 'lcp',
          value: metrics.lcp,
          timestamp: metrics.timestamp,
          tags: { url: metrics.url },
        }),
        this.recordMetric({
          name: 'fid',
          value: metrics.fid,
          timestamp: metrics.timestamp,
          tags: { url: metrics.url },
        }),
        this.recordMetric({
          name: 'cls',
          value: metrics.cls,
          timestamp: metrics.timestamp,
          tags: { url: metrics.url },
        }),
      ]);
    } catch (error) {
      logger.error('Error recording page load metrics', { metrics, error });
    }
  }

  // Update metric aggregates
  private static async updateAggregates(metric: PerformanceMetric): Promise<void> {
    const timestamp = new Date(metric.timestamp);
    const hourKey = `${this.METRIC_PREFIX}${metric.name}:hour:${timestamp.getUTCFullYear()}-${timestamp.getUTCMonth()}-${timestamp.getUTCDate()}-${timestamp.getUTCHours()}`;
    const dayKey = `${this.METRIC_PREFIX}${metric.name}:day:${timestamp.getUTCFullYear()}-${timestamp.getUTCMonth()}-${timestamp.getUTCDate()}`;

    try {
      const pipeline = redis.pipeline();

      // Update hourly stats
      pipeline.hincrby(hourKey, 'count', 1);
      pipeline.hincrbyfloat(hourKey, 'sum', metric.value);
      pipeline.expire(hourKey, 7 * 24 * 60 * 60); // Keep hourly stats for 7 days

      // Update daily stats
      pipeline.hincrby(dayKey, 'count', 1);
      pipeline.hincrbyfloat(dayKey, 'sum', metric.value);
      pipeline.expire(dayKey, 30 * 24 * 60 * 60); // Keep daily stats for 30 days

      await pipeline.exec();
    } catch (error) {
      logger.error('Error updating metric aggregates', { metric, error });
    }
  }

  // Get aggregated metrics
  static async getMetrics(
    name: string,
    period: 'hour' | 'day',
    from: Date,
    to: Date
  ): Promise<Array<{ timestamp: Date; avg: number; count: number }>> {
    const metrics: Array<{ timestamp: Date; avg: number; count: number }> = [];
    let current = new Date(from);

    while (current <= to) {
      const key = `${this.METRIC_PREFIX}${name}:${period}:${current.getUTCFullYear()}-${current.getUTCMonth()}-${current.getUTCDate()}${period === 'hour' ? '-' + current.getUTCHours() : ''}`;

      try {
        const [count, sum] = await Promise.all([
          redis.hget(key, 'count'),
          redis.hget(key, 'sum'),
        ]);

        if (count && sum) {
          metrics.push({
            timestamp: new Date(current),
            avg: parseFloat(sum as string) / parseInt(count as string),
            count: parseInt(count as string),
          });
        }
      } catch (error) {
        logger.error('Error fetching metrics', { name, period, key, error });
      }

      // Increment current time
      if (period === 'hour') {
        current.setUTCHours(current.getUTCHours() + 1);
      } else {
        current.setUTCDate(current.getUTCDate() + 1);
      }
    }

    return metrics;
  }

  // Middleware to track API performance
  static middleware() {
    return async (req: NextRequest, res: NextResponse) => {
      const start = Date.now();

      try {
        // Wait for response
        await res;
      } finally {
        const duration = Date.now() - start;
        const url = new URL(req.url).pathname;

        await this.recordMetric({
          name: 'api_latency',
          value: duration,
          timestamp: start,
          tags: {
            method: req.method,
            path: url,
            status: res.status.toString(),
          },
        });
      }
    };
  }
}

// Client-side performance monitoring script
export const performanceMonitoringScript = `
  // Record Web Vitals
  function recordWebVitals() {
    let metrics = {};
    
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
        if (entry.name === 'largest-contentful-paint') {
          metrics.lcp = entry.startTime;
        }
        if (entry.name === 'first-input') {
          metrics.fid = entry.processingStart - entry.startTime;
        }
        if (entry.name === 'layout-shift') {
          metrics.cls = (metrics.cls || 0) + entry.value;
        }
      }
    }).observe({ entryTypes: ['paint', 'first-input', 'layout-shift'] });

    // Record TTFB
    const navEntry = performance.getEntriesByType('navigation')[0];
    metrics.ttfb = navEntry.responseStart;

    // Send metrics to server
    window.addEventListener('load', () => {
      setTimeout(() => {
        fetch('/api/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...metrics,
            url: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          }),
        });
      }, 0);
    });
  }

  recordWebVitals();
`;
