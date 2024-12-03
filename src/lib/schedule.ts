import { Redis } from 'ioredis';
import { getIO } from './socket';
import { sendNotification } from './notifications';

const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!);

export interface Schedule {
  id: string;
  userId: string;
  type: 'CLEANING' | 'MAINTENANCE' | 'INSPECTION';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startTime: Date;
  endTime: Date;
  location: string;
  notes?: string;
  assignedTo?: string[];
  metadata?: Record<string, any>;
}

export interface ScheduleUpdate {
  scheduleId: string;
  userId: string;
  status: Schedule['status'];
  notes?: string;
  timestamp: Date;
}

export async function createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
  const id = `schedule:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const fullSchedule: Schedule = {
    ...schedule,
    id,
  };

  // Store schedule in Redis
  await redis.setex(
    `schedule:${id}`,
    60 * 60 * 24 * 30, // 30 days
    JSON.stringify(fullSchedule)
  );

  // Add to user's schedules
  await redis.sadd(`user:${schedule.userId}:schedules`, id);

  // Add to assigned users' schedules
  if (schedule.assignedTo) {
    for (const userId of schedule.assignedTo) {
      await redis.sadd(`user:${userId}:assigned`, id);
      
      // Send notification to assigned user
      await sendNotification({
        userId,
        type: 'INFO',
        title: 'New Schedule Assignment',
        message: `You have been assigned to a new ${schedule.type.toLowerCase()} task.`,
        metadata: { scheduleId: id },
      });
    }
  }

  // Send real-time update
  const io = getIO();
  io.to(`user:${schedule.userId}`).emit('scheduleUpdate', {
    type: 'CREATED',
    schedule: fullSchedule,
  });

  return fullSchedule;
}

export async function updateScheduleStatus(
  scheduleId: string,
  update: Omit<ScheduleUpdate, 'scheduleId' | 'timestamp'>
): Promise<boolean> {
  const scheduleData = await redis.get(`schedule:${scheduleId}`);
  if (!scheduleData) return false;

  const schedule = JSON.parse(scheduleData) as Schedule;
  const previousStatus = schedule.status;
  schedule.status = update.status;
  if (update.notes) schedule.notes = update.notes;

  // Update schedule in Redis
  await redis.setex(
    `schedule:${scheduleId}`,
    60 * 60 * 24 * 30, // 30 days
    JSON.stringify(schedule)
  );

  // Store update history
  const updateRecord: ScheduleUpdate = {
    ...update,
    scheduleId,
    timestamp: new Date(),
  };
  await redis.lpush(
    `schedule:${scheduleId}:updates`,
    JSON.stringify(updateRecord)
  );

  // Send notifications
  if (schedule.assignedTo) {
    for (const userId of schedule.assignedTo) {
      await sendNotification({
        userId,
        type: 'INFO',
        title: 'Schedule Update',
        message: `Schedule status changed from ${previousStatus} to ${update.status}`,
        metadata: { scheduleId },
      });
    }
  }

  // Send real-time update
  const io = getIO();
  io.to(`schedule:${scheduleId}`).emit('scheduleUpdate', {
    type: 'STATUS_CHANGED',
    schedule,
    update: updateRecord,
  });

  return true;
}

export async function getSchedule(scheduleId: string): Promise<Schedule | null> {
  const data = await redis.get(`schedule:${scheduleId}`);
  return data ? JSON.parse(data) : null;
}

export async function getUserSchedules(userId: string): Promise<Schedule[]> {
  const scheduleIds = await redis.smembers(`user:${userId}:schedules`);
  const schedules: Schedule[] = [];

  for (const id of scheduleIds) {
    const data = await redis.get(`schedule:${id}`);
    if (data) {
      schedules.push(JSON.parse(data));
    }
  }

  return schedules.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

export async function getAssignedSchedules(userId: string): Promise<Schedule[]> {
  const scheduleIds = await redis.smembers(`user:${userId}:assigned`);
  const schedules: Schedule[] = [];

  for (const id of scheduleIds) {
    const data = await redis.get(`schedule:${id}`);
    if (data) {
      schedules.push(JSON.parse(data));
    }
  }

  return schedules.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}
