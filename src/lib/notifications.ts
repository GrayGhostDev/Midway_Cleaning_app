import { getIO } from './socket';
import { Redis } from 'ioredis';
import { clerkClient } from '@clerk/nextjs';

const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!);

export interface Notification {
  id: string;
  userId: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export async function sendNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
  const id = `notification:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const fullNotification: Notification = {
    ...notification,
    id,
    read: false,
    createdAt: new Date(),
  };

  // Store notification in Redis
  await redis.setex(
    `notifications:${notification.userId}:${id}`,
    60 * 60 * 24 * 7, // 7 days
    JSON.stringify(fullNotification)
  );

  // Send real-time notification
  const io = getIO();
  io.to(`user:${notification.userId}`).emit('notification', fullNotification);

  return fullNotification;
}

export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  const pattern = `notifications:${userId}:*`;
  const keys = await redis.keys(pattern);
  const notifications: Notification[] = [];

  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const notification = JSON.parse(data) as Notification;
      if (!notification.read) {
        notifications.push(notification);
      }
    }
  }

  return notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
  const key = `notifications:${userId}:${notificationId}`;
  const data = await redis.get(key);
  
  if (!data) return false;

  const notification = JSON.parse(data) as Notification;
  notification.read = true;

  await redis.setex(
    key,
    60 * 60 * 24 * 7, // 7 days
    JSON.stringify(notification)
  );

  return true;
}

export async function sendBulkNotification(
  userIds: string[],
  notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'userId'>
) {
  const notifications = await Promise.all(
    userIds.map(userId =>
      sendNotification({
        ...notification,
        userId,
      })
    )
  );

  return notifications;
}

export async function sendRoleNotification(
  role: string,
  notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'userId'>
) {
  const users = await clerkClient.users.getUserList({
    // Add role filtering when available in Clerk
  });

  return sendBulkNotification(
    users.map(user => user.id),
    notification
  );
}
