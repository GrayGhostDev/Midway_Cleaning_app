import { createLogger } from './logger';
import { captureException } from './sentry';

const logger = createLogger('Uptime');

export class UptimeMonitor {
  private static instance: UptimeMonitor;
  private checkInterval: NodeJS.Timeout | null = null;
  private endpoints: Map<string, { url: string; timeout: number }>;
  private status: Map<string, boolean>;

  private constructor() {
    this.endpoints = new Map();
    this.status = new Map();
  }

  static getInstance(): UptimeMonitor {
    if (!UptimeMonitor.instance) {
      UptimeMonitor.instance = new UptimeMonitor();
    }
    return UptimeMonitor.instance;
  }

  registerEndpoint(name: string, url: string, timeout: number = 5000) {
    this.endpoints.set(name, { url, timeout });
    this.status.set(name, true);
  }

  async checkEndpoint(name: string): Promise<boolean> {
    const endpoint = this.endpoints.get(name);
    if (!endpoint) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout);

      const response = await fetch(endpoint.url, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const isUp = response.ok;
      this.status.set(name, isUp);

      if (!isUp) {
        logger.error(`Endpoint ${name} is down`, undefined, {
          url: endpoint.url,
          status: response.status,
        });
      }

      return isUp;
    } catch (error) {
      this.status.set(name, false);
      logger.error(`Failed to check endpoint ${name}`, error as Error, {
        url: endpoint.url,
      });
      captureException(error as Error);
      return false;
    }
  }

  async checkAll(): Promise<Map<string, boolean>> {
    const results = await Promise.all(
      Array.from(this.endpoints.keys()).map(async (name) => {
        const isUp = await this.checkEndpoint(name);
        return [name, isUp] as [string, boolean];
      })
    );

    return new Map(results);
  }

  startMonitoring(interval: number = 60000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      await this.checkAll();
    }, interval);
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getStatus(name: string): boolean {
    return this.status.get(name) ?? false;
  }

  getAllStatus(): Map<string, boolean> {
    return new Map(this.status);
  }
}

// Helper function to initialize uptime monitoring
export const initializeUptimeMonitoring = (
  endpoints: Array<{ name: string; url: string; timeout?: number }>,
  checkInterval?: number
) => {
  const monitor = UptimeMonitor.getInstance();

  endpoints.forEach(({ name, url, timeout }) => {
    monitor.registerEndpoint(name, url, timeout);
  });

  monitor.startMonitoring(checkInterval);

  return monitor;
};
