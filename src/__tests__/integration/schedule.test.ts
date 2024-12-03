import { createSchedule, updateScheduleStatus, getSchedule } from '@/lib/schedule';
import { sendScheduleReminder } from '@/lib/email/sender';
import { Redis } from 'ioredis';
import { Server } from 'socket.io';

// Create a real Redis instance for integration testing
const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!);

describe('Schedule Integration Tests', () => {
  let io: Server;

  beforeAll(() => {
    // Setup Socket.IO server
    io = new Server();
  });

  afterAll(async () => {
    // Cleanup
    await redis.quit();
    io.close();
  });

  beforeEach(async () => {
    // Clear Redis test data
    const keys = await redis.keys('schedule:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  });

  describe('Schedule Creation and Updates', () => {
    it('should create schedule and send notifications', async () => {
      const scheduleData = {
        userId: 'test-user',
        type: 'CLEANING' as const,
        status: 'PENDING' as const,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
        location: '123 Test St',
        assignedTo: ['cleaner1', 'cleaner2'],
      };

      // Create schedule
      const schedule = await createSchedule(scheduleData);
      expect(schedule).toBeDefined();
      expect(schedule.id).toBeDefined();
      expect(schedule.status).toBe('PENDING');

      // Verify schedule was stored in Redis
      const storedSchedule = await getSchedule(schedule.id);
      expect(storedSchedule).toBeDefined();
      expect(storedSchedule?.status).toBe('PENDING');

      // Update schedule status
      const updateResult = await updateScheduleStatus(schedule.id, {
        userId: 'cleaner1',
        status: 'IN_PROGRESS',
        notes: 'Started cleaning',
      });
      expect(updateResult).toBe(true);

      // Verify status was updated
      const updatedSchedule = await getSchedule(schedule.id);
      expect(updatedSchedule?.status).toBe('IN_PROGRESS');
      expect(updatedSchedule?.notes).toBe('Started cleaning');
    });

    it('should handle concurrent schedule updates correctly', async () => {
      const schedule = await createSchedule({
        userId: 'test-user',
        type: 'CLEANING',
        status: 'PENDING',
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: '123 Test St',
      });

      // Simulate concurrent updates
      const updates = [
        updateScheduleStatus(schedule.id, {
          userId: 'user1',
          status: 'IN_PROGRESS',
          notes: 'Update 1',
        }),
        updateScheduleStatus(schedule.id, {
          userId: 'user2',
          status: 'COMPLETED',
          notes: 'Update 2',
        }),
      ];

      await Promise.all(updates);

      // Verify final state
      const finalSchedule = await getSchedule(schedule.id);
      expect(finalSchedule?.status).toBeDefined();
      expect(['IN_PROGRESS', 'COMPLETED']).toContain(finalSchedule?.status);
    });
  });

  describe('Schedule Notifications', () => {
    it('should send schedule reminders', async () => {
      const schedule = await createSchedule({
        userId: 'test-user',
        type: 'CLEANING',
        status: 'PENDING',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
        location: '123 Test St',
      });

      const reminderSent = await sendScheduleReminder(schedule, 'test@example.com');
      expect(reminderSent).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent schedule gracefully', async () => {
      const nonExistentId = 'non-existent-id';
      
      const schedule = await getSchedule(nonExistentId);
      expect(schedule).toBeNull();

      await expect(
        updateScheduleStatus(nonExistentId, {
          userId: 'test-user',
          status: 'IN_PROGRESS',
        })
      ).rejects.toThrow();
    });

    it('should validate schedule data', async () => {
      const invalidSchedule = {
        userId: 'test-user',
        type: 'INVALID_TYPE' as any,
        status: 'PENDING' as const,
        startTime: new Date(),
        endTime: new Date(Date.now() - 1000), // End time before start time
        location: '123 Test St',
      };

      await expect(createSchedule(invalidSchedule)).rejects.toThrow();
    });
  });
});
