import { fetchAPI } from './api';

export interface CheckInData {
  employeeId: number;
  locationId: number;
  type: 'in' | 'out';
  timestamp: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PhotoUpload {
  taskId: number;
  description: string;
  imageUrl: string;
  timestamp: string;
  location?: string;
}

export class MobileService {
  static async checkInOut(data: CheckInData): Promise<void> {
    return fetchAPI<void>('/mobile/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async uploadPhoto(data: Omit<PhotoUpload, 'timestamp'>): Promise<PhotoUpload> {
    return fetchAPI<PhotoUpload>('/mobile/photos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getTaskUpdates(employeeId: number): Promise<{
    tasks: Array<{
      id: number;
      title: string;
      status: string;
      priority: string;
    }>;
  }> {
    return fetchAPI(`/mobile/tasks/${employeeId}`);
  }

  static async submitTaskUpdate(
    taskId: number,
    update: {
      status: string;
      notes?: string;
      photos?: string[];
    }
  ): Promise<void> {
    return fetchAPI<void>(`/mobile/tasks/${taskId}/update`, {
      method: 'POST',
      body: JSON.stringify(update),
    });
  }
}