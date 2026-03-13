import { NotificationService } from '../notification.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should fetch notifications without filters', async () => {
      const mockNotifications = [
        { id: 1, type: 'Alert', title: 'Low stock', message: 'Glass cleaner running low', priority: 'High', timestamp: '2024-02-01', read: false },
      ];
      mockFetchAPI.mockResolvedValue(mockNotifications);

      const result = await NotificationService.getNotifications();

      expect(mockFetchAPI).toHaveBeenCalledWith(expect.stringContaining('/notifications'));
      expect(result).toEqual(mockNotifications);
    });

    it('should fetch unread notifications only', async () => {
      mockFetchAPI.mockResolvedValue([]);

      await NotificationService.getNotifications({ unreadOnly: true });

      expect(mockFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('unreadOnly=true')
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await NotificationService.markAsRead(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/notifications/1/read', {
        method: 'PUT',
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await NotificationService.markAllAsRead();

      expect(mockFetchAPI).toHaveBeenCalledWith('/notifications/read-all', {
        method: 'PUT',
      });
    });
  });

  describe('getPreferences', () => {
    it('should fetch notification preferences', async () => {
      const mockPrefs = {
        email: true,
        push: true,
        sms: false,
        categories: { tasks: true, inventory: true, quality: true, schedule: true, system: false },
      };
      mockFetchAPI.mockResolvedValue(mockPrefs);

      const result = await NotificationService.getPreferences();

      expect(mockFetchAPI).toHaveBeenCalledWith('/notifications/preferences');
      expect(result).toEqual(mockPrefs);
    });
  });

  describe('updatePreferences', () => {
    it('should update notification preferences', async () => {
      const updates = { sms: true };
      mockFetchAPI.mockResolvedValue({ email: true, push: true, sms: true });

      const result = await NotificationService.updatePreferences(updates);

      expect(mockFetchAPI).toHaveBeenCalledWith('/notifications/preferences', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      expect(result.sms).toBe(true);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to a topic', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await NotificationService.subscribe('inventory-alerts');

      expect(mockFetchAPI).toHaveBeenCalledWith('/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({ topic: 'inventory-alerts' }),
      });
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from a topic', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await NotificationService.unsubscribe('inventory-alerts');

      expect(mockFetchAPI).toHaveBeenCalledWith('/notifications/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ topic: 'inventory-alerts' }),
      });
    });
  });
});
