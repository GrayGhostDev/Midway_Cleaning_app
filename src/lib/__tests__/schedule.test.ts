import { createSchedule, updateScheduleStatus, getSchedule, getUserSchedules } from '../schedule';

// Mock Socket.IO
jest.mock('../socket', () => ({
  getIO: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  })),
}));

// Mock notifications
jest.mock('../notifications', () => ({
  sendNotification: jest.fn().mockResolvedValue({ id: 'notif_1' }),
}));

// ioredis is already mocked in jest.setup.ts via ioredis-mock

describe('Schedule Library', () => {
  const mockScheduleInput = {
    userId: 'user_1',
    type: 'CLEANING' as const,
    status: 'PENDING' as const,
    startTime: new Date('2024-03-01T09:00:00Z'),
    endTime: new Date('2024-03-01T17:00:00Z'),
    location: 'Office A',
    notes: 'Deep clean requested',
    assignedTo: ['user_2', 'user_3'],
  };

  describe('createSchedule', () => {
    it('should create a schedule with generated ID', async () => {
      const result = await createSchedule(mockScheduleInput);

      expect(result).toHaveProperty('id');
      expect(result.id).toMatch(/^schedule:/);
      expect(result.userId).toBe('user_1');
      expect(result.type).toBe('CLEANING');
      expect(result.status).toBe('PENDING');
    });

    it('should send notifications to assigned users', async () => {
      const { sendNotification } = require('../notifications');

      await createSchedule(mockScheduleInput);

      expect(sendNotification).toHaveBeenCalledTimes(2);
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_2',
          type: 'INFO',
          title: 'New Schedule Assignment',
        })
      );
    });

    it('should emit real-time update via Socket.IO', async () => {
      const { getIO } = require('../socket');

      await createSchedule(mockScheduleInput);

      const mockIO = getIO();
      expect(mockIO.to).toHaveBeenCalledWith('user:user_1');
      expect(mockIO.emit).toHaveBeenCalledWith('scheduleUpdate', expect.objectContaining({
        type: 'CREATED',
      }));
    });

    it('should handle schedules without assigned users', async () => {
      const { sendNotification } = require('../notifications');
      const scheduleWithoutAssignees = { ...mockScheduleInput, assignedTo: undefined };

      const result = await createSchedule(scheduleWithoutAssignees);

      expect(result).toHaveProperty('id');
      expect(sendNotification).not.toHaveBeenCalled();
    });
  });

  describe('getSchedule', () => {
    it('should return null for non-existent schedule', async () => {
      const result = await getSchedule('nonexistent_id');

      expect(result).toBeNull();
    });

    it('should return a schedule after creation', async () => {
      const created = await createSchedule(mockScheduleInput);
      const result = await getSchedule(created.id);

      expect(result).not.toBeNull();
      expect(result!.userId).toBe('user_1');
    });
  });

  describe('updateScheduleStatus', () => {
    it('should return false for non-existent schedule', async () => {
      const result = await updateScheduleStatus('nonexistent', {
        userId: 'user_1',
        status: 'COMPLETED',
      });

      expect(result).toBe(false);
    });

    it('should update schedule status', async () => {
      const created = await createSchedule(mockScheduleInput);

      const result = await updateScheduleStatus(created.id, {
        userId: 'user_1',
        status: 'IN_PROGRESS',
      });

      expect(result).toBe(true);

      const updated = await getSchedule(created.id);
      expect(updated!.status).toBe('IN_PROGRESS');
    });

    it('should update notes when provided', async () => {
      const created = await createSchedule(mockScheduleInput);

      await updateScheduleStatus(created.id, {
        userId: 'user_1',
        status: 'IN_PROGRESS',
        notes: 'Started early',
      });

      const updated = await getSchedule(created.id);
      expect(updated!.notes).toBe('Started early');
    });
  });

  describe('getUserSchedules', () => {
    it('should return empty array for user with no schedules', async () => {
      const result = await getUserSchedules('unknown_user');

      expect(result).toEqual([]);
    });

    it('should return schedules sorted by start time', async () => {
      const later = { ...mockScheduleInput, startTime: new Date('2024-03-02T09:00:00Z') };
      const earlier = { ...mockScheduleInput, startTime: new Date('2024-03-01T09:00:00Z') };

      await createSchedule(later);
      await createSchedule(earlier);

      const result = await getUserSchedules('user_1');

      expect(result.length).toBeGreaterThanOrEqual(2);
      const times = result.map(s => new Date(s.startTime).getTime());
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
      }
    });
  });
});
