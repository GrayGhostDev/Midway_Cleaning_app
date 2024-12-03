import { Analytics } from '@segment/analytics-node';
import { createLogger } from './logger';

const logger = createLogger('Analytics');
const analytics = new Analytics({ writeKey: process.env.SEGMENT_WRITE_KEY! });

export const trackEvent = async (
  event: string,
  userId: string,
  properties?: Record<string, any>
) => {
  try {
    await analytics.track({
      event,
      userId,
      properties: {
        ...properties,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Failed to track event', error as Error, { event, userId, properties });
  }
};

export const identifyUser = async (
  userId: string,
  traits: Record<string, any>
) => {
  try {
    await analytics.identify({
      userId,
      traits: {
        ...traits,
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    logger.error('Failed to identify user', error as Error, { userId, traits });
  }
};

export const trackPageView = async (
  userId: string,
  page: string,
  properties?: Record<string, any>
) => {
  try {
    await analytics.page({
      userId,
      name: page,
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : '',
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Failed to track page view', error as Error, {
      userId,
      page,
      properties,
    });
  }
};
