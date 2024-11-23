import { fetchAPI } from './api';

export interface ClientMessage {
  id: number;
  subject: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  attachments?: {
    id: number;
    name: string;
    url: string;
  }[];
  thread: {
    id: number;
    messages: {
      id: number;
      sender: {
        id: number;
        name: string;
        role: string;
        avatar?: string;
      };
      content: string;
      timestamp: string;
      attachments?: {
        id: number;
        name: string;
        url: string;
      }[];
    }[];
  };
}

export interface ClientNotification {
  id: number;
  type: 'service' | 'payment' | 'feedback' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    type: 'link' | 'button';
    label: string;
    url?: string;
  };
}

export class ClientService {
  static async getMessages(params?: {
    status?: string;
    department?: string;
  }): Promise<ClientMessage[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<ClientMessage[]>(`/client/messages?${queryParams}`);
  }

  static async getMessageThread(threadId: number): Promise<ClientMessage['thread']> {
    return fetchAPI<ClientMessage['thread']>(`/client/messages/${threadId}/thread`);
  }

  static async sendMessage(data: {
    threadId?: number;
    subject?: string;
    content: string;
    department?: string;
    priority?: string;
    attachments?: File[];
  }): Promise<ClientMessage> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !(value instanceof File)) {
        formData.append(key, value.toString());
      }
    });
    
    if (data.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    return fetchAPI<ClientMessage>('/client/messages', {
      method: 'POST',
      body: formData,
    });
  }

  static async markMessageAsRead(messageId: number): Promise<void> {
    return fetchAPI<void>(`/client/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  static async getNotifications(): Promise<ClientNotification[]> {
    return fetchAPI<ClientNotification[]>('/client/notifications');
  }

  static async markNotificationAsRead(notificationId: number): Promise<void> {
    return fetchAPI<void>(`/client/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  static async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    preferences?: {
      notifications?: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
      };
      communication?: {
        preferredMethod?: string;
        language?: string;
      };
    };
  }): Promise<void> {
    return fetchAPI<void>('/client/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}