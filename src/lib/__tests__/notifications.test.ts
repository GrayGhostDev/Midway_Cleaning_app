import { sendNotification, getUnreadNotifications, markNotificationAsRead, sendBulkNotification } from '../notifications';

// Mock Socket.IO
jest.mock('../socket', () => ({
  getIO: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  })),
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  clerkClient: {
    users: {
      getUserList: jest.fn().mockResolvedValue([
        { id: 'user_1' },
        { id: 'user_2' },
      ]),
    },
  },
}));

// ioredis is mocked in jest.setup.ts via ioredis-mock

describe('Notifications Library', () => {
  describe('sendNotification', () => {
    it('should create a notification with generated ID', async () => {
      const result = await sendNotification({
        userId: 'user_1',
        type: 'INFO',
        title: 'Test Notification',
        message: 'This is a test',
      });

      expect(result).toHaveProperty('id');
      expect(result.id).toMatch(/^notification:/);
      expect(result.read).toBe(false);
      expect(result.createdAt).toBeDefined();
    });

    it('should emit real-time notification via Socket.IO', async () => {
      const { getIO } = require('../socket');

      await sendNotification({
        userId: 'user_1',
        type: 'SUCCESS',
        title: 'Task Complete',
        message: 'Your task has been completed',
      });

      const mockIO = getIO();
      expect(mockIO.to).toHaveBeenCalledWith('user:user_1');
      expect(mockIO.emit).toHaveBeenCalledWith('notification', expect.objectContaining({
        type: 'SUCCESS',
        title: 'Task Complete',
      }));
    });

    it('should include metadata when provided', async () => {
      const result = await sendNotification({
        userId: 'user_1',
        type: 'INFO',
        title: 'Schedule Update',
        message: 'New assignment',
        metadata: { scheduleId: 'sched_1' },
      });

      expect(result.metadata).toEqual({ scheduleId: 'sched_1' });
    });
  });

  describe('getUnreadNotifications', () => {
    it('should return empty array for user with no notifications', async () => {
      const result = await getUnreadNotifications('unknown_user');

      expect(result).toEqual([]);
    });

    it('should return only unread notifications', async () => {
      // Send two notifications
      await sendNotification({
        userId: 'user_unread_test',
        type: 'INFO',
        title: 'Notification 1',
        message: 'First',
      });
      await sendNotification({
        userId: 'user_unread_test',
        type: 'WARNING',
        title: 'Notification 2',
        message: 'Second',
      });

      const result = await getUnreadNotifications('user_unread_test');

      expect(result.length).toBeGreaterThanOrEqual(2);
      result.forEach(n => expect(n.read).toBe(false));
    });

    it('should sort notifications by creation time (newest first)', async () => {
      await sendNotification({
        userId: 'user_sort_test',
        type: 'INFO',
        title: 'Older',
        message: 'First notification',
      });
      await sendNotification({
        userId: 'user_sort_test',
        type: 'INFO',
        title: 'Newer',
        message: 'Second notification',
      });

      const result = await getUnreadNotifications('user_sort_test');

      if (result.length >= 2) {
        const times = result.map(n => new Date(n.createdAt).getTime());
        expect(times[0]).toBeGreaterThanOrEqual(times[1]);
      }
    });
  });

  describe('markNotificationAsRead', () => {
    it('should return false for non-existent notification', async () => {
      const result = await markNotificationAsRead('user_1', 'nonexistent');

      expect(result).toBe(false);
    });

    it('should mark notification as read', async () => {
      const notification = await sendNotification({
        userId: 'user_mark_test',
        type: 'INFO',
        title: 'Read me',
        message: 'Mark this as read',
      });

      const result = await markNotificationAsRead('user_mark_test', notification.id);

      expect(result).toBe(true);
    });
  });

  describe('sendBulkNotification', () => {
    it('should send notifications to multiple users', async () => {
      const userIds = ['user_bulk_1', 'user_bulk_2', 'user_bulk_3'];

      const results = await sendBulkNotification(userIds, {
        type: 'INFO',
        title: 'Bulk Update',
        message: 'Company-wide announcement',
      });

      expect(results).toHaveLength(3);
      results.forEach((n, i) => {
        expect(n.userId).toBe(userIds[i]);
        expect(n.title).toBe('Bulk Update');
      });
    });
  });
});
