import { fetchAPI } from './api';

export interface Notification {
  id: number;
  type: 'Alert' | 'Reminder' | 'Update' | 'Task' | 'System';
  title: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
  actions?: {
    type: 'link' | 'button';
    label: string;
    url?: string;
    action?: string;
  }[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    tasks: boolean;
    inventory: boolean;
    quality: boolean;
    schedule: boolean;
    system: boolean;
  };
}

export class NotificationService {
  static async getNotifications(params?: {
    unreadOnly?: boolean;
    limit?: number;
    type?: string;
  }): Promise<Notification[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<Notification[]>(`/notifications?${queryParams}`);
  }

  static async markAsRead(notificationId: number): Promise<void> {
    return fetchAPI<void>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  static async markAllAsRead(): Promise<void> {
    return fetchAPI<void>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  static async getPreferences(): Promise<NotificationPreferences> {
    return fetchAPI<NotificationPreferences>('/notifications/preferences');
  }

  static async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return fetchAPI<NotificationPreferences>('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  static async subscribe(topic: string): Promise<void> {
    return fetchAPI<void>('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  }

  static async unsubscribe(topic: string): Promise<void> {
    return fetchAPI<void>('/notifications/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  }
}