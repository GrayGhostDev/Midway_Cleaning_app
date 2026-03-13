// Notifications stub -- ioredis is not installed, socket.io server not configured.
// Will be replaced with Supabase Realtime or direct fetch when ready.

export interface Notification {
  id: string;
  userId: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export async function sendNotification(
  notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Promise<Notification> {
  const id = `notification:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const fullNotification: Notification = {
    ...notification,
    id,
    read: false,
    createdAt: new Date(),
  };

  console.log('[NOTIFICATIONS STUB] sendNotification:', {
    id,
    userId: notification.userId,
    type: notification.type,
    title: notification.title,
  });

  return fullNotification;
}

export async function getUnreadNotifications(_userId: string): Promise<Notification[]> {
  return [];
}

export async function markNotificationAsRead(
  _userId: string,
  _notificationId: string
): Promise<boolean> {
  return true;
}

export async function sendBulkNotification(
  userIds: string[],
  notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'userId'>
): Promise<Notification[]> {
  return Promise.all(
    userIds.map(userId =>
      sendNotification({ ...notification, userId })
    )
  );
}

export async function sendRoleNotification(
  _role: string,
  _notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'userId'>
): Promise<Notification[]> {
  console.log('[NOTIFICATIONS STUB] sendRoleNotification -- no-op');
  return [];
}
