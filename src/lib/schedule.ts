// Schedule module stub — will be reimplemented with Supabase Realtime.
// Original implementation used ioredis + socket.io.

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
  metadata?: Record<string, unknown>;
}

export interface ScheduleUpdate {
  scheduleId: string;
  userId: string;
  status: Schedule['status'];
  notes?: string;
  timestamp: Date;
}

export async function createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
  console.warn('[SCHEDULE STUB] createSchedule called — not implemented');
  return { ...schedule, id: `schedule:stub` };
}

export async function updateScheduleStatus(
  _scheduleId: string,
  _update: Omit<ScheduleUpdate, 'scheduleId' | 'timestamp'>
): Promise<boolean> {
  console.warn('[SCHEDULE STUB] updateScheduleStatus called — not implemented');
  return false;
}

export async function getSchedule(_scheduleId: string): Promise<Schedule | null> {
  console.warn('[SCHEDULE STUB] getSchedule called — not implemented');
  return null;
}

export async function getUserSchedules(_userId: string): Promise<Schedule[]> {
  console.warn('[SCHEDULE STUB] getUserSchedules called — not implemented');
  return [];
}

export async function getAssignedSchedules(_userId: string): Promise<Schedule[]> {
  console.warn('[SCHEDULE STUB] getAssignedSchedules called — not implemented');
  return [];
}
