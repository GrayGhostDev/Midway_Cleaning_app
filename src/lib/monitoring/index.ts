export * from './sentry';
export * from './logger';
export * from './analytics';
export * from './performance';
export * from './uptime';

// Initialize all monitoring systems
import { initializeSentry } from './sentry';
import { createLogger } from './logger';
import { PerformanceMonitor } from './performance';
import { initializeUptimeMonitoring } from './uptime';

const logger = createLogger('Monitoring');

export const initializeMonitoring = () => {
  try {
    // Initialize Sentry
    initializeSentry();
    logger.info('Sentry initialized');

    // Initialize Performance Monitoring
    PerformanceMonitor.getInstance();
    logger.info('Performance monitoring initialized');

    // Initialize Uptime Monitoring
    const endpoints = [
      { name: 'API', url: `${process.env.NEXT_PUBLIC_APP_URL}/api/health` },
      { name: 'Database', url: `${process.env.NEXT_PUBLIC_APP_URL}/api/health/db` },
      { name: 'Redis', url: `${process.env.NEXT_PUBLIC_APP_URL}/api/health/redis` },
    ];

    initializeUptimeMonitoring(endpoints, 300000); // Check every 5 minutes
    logger.info('Uptime monitoring initialized');

    logger.info('All monitoring systems initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize monitoring systems', error as Error);
    throw error;
  }
};
