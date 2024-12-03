import { fetchAPI } from './api';

export interface Shift {
  id: number;
  employee: {
    id: number;
    name: string;
    image: string;
  };
  location: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  type: 'Regular' | 'Overtime' | 'On Call';
}

export interface CreateShiftDTO {
  employeeId: number;
  locationId: number;
  startTime: string;
  endTime: string;
  type: Shift['type'];
}

export class ScheduleService {
  static async getShifts(date: string): Promise<Shift[]> {
    return fetchAPI<Shift[]>(`/shifts?date=${date}`);
  }

  static async getShiftById(id: number): Promise<Shift> {
    return fetchAPI<Shift>(`/shifts/${id}`);
  }

  static async createShift(data: CreateShiftDTO): Promise<Shift> {
    return fetchAPI<Shift>('/shifts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateShiftStatus(id: number, status: Shift['status']): Promise<Shift> {
    return fetchAPI<Shift>(`/shifts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  static async deleteShift(id: number): Promise<void> {
    return fetchAPI<void>(`/shifts/${id}`, {
      method: 'DELETE',
    });
  }
}