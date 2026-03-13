import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isUpstashConfigured =
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_URL !== 'your_redis_url' &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  process.env.UPSTASH_REDIS_REST_TOKEN !== 'your_redis_token';

const analyticsLimiter = isUpstashConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : null;

export const rateLimit = {
  analytics: {
    check: async (identifier: string): Promise<{ success: boolean }> => {
      if (!analyticsLimiter) return { success: true };
      return analyticsLimiter.limit(identifier);
    },
  },
};
