jest.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      eval: jest.fn(),
    })),
  },
}));

jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    jest.fn().mockImplementation(() => ({
      limit: jest.fn().mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: Date.now() + 10000 }),
    })),
    {
      slidingWindow: jest.fn().mockReturnValue({ type: 'slidingWindow', tokens: 10, interval: '10 s' }),
    }
  ),
}));

describe('Rate Limit', () => {
  it('should export a ratelimit instance', () => {
    const { ratelimit } = require('../rate-limit');

    expect(ratelimit).toBeDefined();
    expect(ratelimit.limit).toBeDefined();
  });

  it('should be configured with sliding window limiter', () => {
    const { Ratelimit } = require('@upstash/ratelimit');

    expect(Ratelimit.slidingWindow).toHaveBeenCalledWith(10, '10 s');
  });

  it('should use Redis from environment', () => {
    const { Redis } = require('@upstash/redis');

    expect(Redis.fromEnv).toHaveBeenCalled();
  });

  it('should allow requests within the limit', async () => {
    const { ratelimit } = require('../rate-limit');

    const result = await ratelimit.limit('test-identifier');

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
  });
});
