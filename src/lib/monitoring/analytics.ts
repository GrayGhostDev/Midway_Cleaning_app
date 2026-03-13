// Analytics stub -- @segment/analytics-node is not installed.
// Install it when Segment analytics tracking is needed.

import { createLogger } from './logger';

const logger = createLogger('Analytics');

export const trackEvent = async (
  event: string,
  userId: string,
  properties?: Record<string, unknown>
) => {
  logger.debug(`Track event: ${event}`, { userId, properties });
};

export const identifyUser = async (
  userId: string,
  traits: Record<string, unknown>
) => {
  logger.debug(`Identify user: ${userId}`, { traits });
};

export const trackPageView = async (
  userId: string,
  page: string,
  properties?: Record<string, unknown>
) => {
  logger.debug(`Page view: ${page}`, { userId, properties });
};
