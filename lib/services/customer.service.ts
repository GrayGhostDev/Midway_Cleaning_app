import { fetchAPI } from './api';

export interface ServiceBooking {
  id: number;
  serviceType: string;
  location: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface ServiceHistory {
  id: number;
  type: string;
  location: string;
  date: string;
  time: string;
  status: string;
  rating?: number;
  feedback?: string;
}

export interface CustomerDocument {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
  category: string;
}

export interface CustomerMessage {
  id: number;
  sender: {
    name: string;
    image?: string;
    role: string;
  };
  content: string;
  timestamp: string;
  isCustomer: boolean;
}

export class CustomerService {
  static async bookService(data: Omit<ServiceBooking, 'id' | 'status'>): Promise<ServiceBooking> {
    return fetchAPI<ServiceBooking>('/customer/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getServiceHistory(): Promise<ServiceHistory[]> {
    return fetchAPI<ServiceHistory[]>('/customer/history');
  }

  static async submitFeedback(bookingId: number, rating: number, feedback: string): Promise<void> {
    return fetchAPI<void>(`/customer/feedback/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
  }

  static async getDocuments(): Promise<CustomerDocument[]> {
    return fetchAPI<CustomerDocument[]>('/customer/documents');
  }

  static async getMessages(): Promise<CustomerMessage[]> {
    return fetchAPI<CustomerMessage[]>('/customer/messages');
  }

  static async sendMessage(content: string): Promise<CustomerMessage> {
    return fetchAPI<CustomerMessage>('/customer/messages', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}