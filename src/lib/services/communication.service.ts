import { fetchAPI } from './api';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  author: {
    id: number;
    name: string;
    role: string;
  };
  timestamp: string;
  attachments?: {
    id: number;
    name: string;
    url: string;
    type: string;
  }[];
  recipients: {
    teams?: string[];
    locations?: string[];
    roles?: string[];
  };
  acknowledgments: {
    required: boolean;
    acknowledgedBy: number[];
  };
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  timestamp: string;
  readBy: number[];
  attachments?: {
    id: number;
    url: string;
    type: string;
  }[];
}

export interface ChatConversation {
  id: number;
  type: 'direct' | 'group';
  participants: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export class CommunicationService {
  static async getAnnouncements(params?: {
    priority?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Announcement[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<Announcement[]>(`/communications/announcements?${queryParams}`);
  }

  static async createAnnouncement(data: Omit<Announcement, 'id' | 'timestamp' | 'acknowledgments'>): Promise<Announcement> {
    return fetchAPI<Announcement>('/communications/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async acknowledgeAnnouncement(id: number): Promise<void> {
    return fetchAPI<void>(`/communications/announcements/${id}/acknowledge`, {
      method: 'POST',
    });
  }

  static async getConversations(): Promise<ChatConversation[]> {
    return fetchAPI<ChatConversation[]>('/communications/conversations');
  }

  static async getMessages(conversationId: number, params?: {
    before?: string;
    limit?: number;
  }): Promise<ChatMessage[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<ChatMessage[]>(`/communications/conversations/${conversationId}/messages?${queryParams}`);
  }

  static async sendMessage(conversationId: number, content: string, attachments?: File[]): Promise<ChatMessage> {
    const formData = new FormData();
    formData.append('content', content);
    attachments?.forEach(file => formData.append('attachments', file));

    return fetchAPI<ChatMessage>(`/communications/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: formData,
    });
  }

  static async markAsRead(conversationId: number, messageIds: number[]): Promise<void> {
    return fetchAPI<void>(`/communications/conversations/${conversationId}/read`, {
      method: 'POST',
      body: JSON.stringify({ messageIds }),
    });
  }
}