import { fetchAPI, APIError, API_BASE_URL } from '../api';

describe('API Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  describe('API_BASE_URL', () => {
    it('should default to localhost:3000/api', () => {
      expect(API_BASE_URL).toContain('/api');
    });
  });

  describe('APIError', () => {
    it('should create an error with status code', () => {
      const error = new APIError(404, 'Not Found');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('APIError');
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
    });
  });

  describe('fetchAPI', () => {
    it('should make a GET request by default', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'test' }),
      });

      const result = await fetchAPI('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should handle endpoint with leading slash', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchAPI('/users');

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).not.toContain('//users');
    });

    it('should handle endpoint without leading slash', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchAPI('users');

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain('/users');
    });

    it('should throw APIError on non-ok response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchAPI('/missing')).rejects.toThrow('API request failed');
    });

    it('should throw on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(fetchAPI('/test')).rejects.toThrow('Network error');
    });

    it('should pass custom options through', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchAPI('/test', {
        method: 'POST',
        body: JSON.stringify({ key: 'value' }),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ key: 'value' }),
        })
      );
    });
  });
});
