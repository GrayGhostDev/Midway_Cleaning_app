import { fetchAPI } from './api';

export interface ShiftTemplate {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  locationId: number;
  requiredStaff: number;
  skills: string[];
}

export interface StaffAvailability {
  employeeId: number;
  availableDays: number[];
  preferredHours: {
    start: string;
    end: string;
  };
  preferences: {
    locations: number[];
    shiftTypes: string[];
  };
}

export class SchedulingService {
  static async getShiftTemplates(): Promise<ShiftTemplate[]> {
    return fetchAPI<ShiftTemplate[]>('/scheduling/templates');
  }

  static async createShiftTemplate(template: Omit<ShiftTemplate, 'id'>): Promise<ShiftTemplate> {
    return fetchAPI<ShiftTemplate>('/scheduling/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  static async getStaffAvailability(employeeId?: number): Promise<StaffAvailability[]> {
    const params = employeeId ? `?employeeId=${employeeId}` : '';
    return fetchAPI<StaffAvailability[]>(`/scheduling/availability${params}`);
  }

  static async updateStaffAvailability(
    employeeId: number,
    availability: Omit<StaffAvailability, 'employeeId'>
  ): Promise<StaffAvailability> {
    return fetchAPI<StaffAvailability>(`/scheduling/availability/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(availability),
    });
  }

  static async generateSchedule(params: {
    startDate: string;
    endDate: string;
    locationIds?: number[];
  }): Promise<{
    shifts: Array<{
      date: string;
      template: ShiftTemplate;
      assignedStaff: Array<{
        employeeId: number;
        name: string;
      }>;
    }>;
  }> {
    return fetchAPI('/scheduling/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async getConflicts(scheduleId: number): Promise<Array<{
    type: 'overlap' | 'availability' | 'skills';
    description: string;
    affectedShifts: number[];
    affectedEmployees: number[];
  }>> {
    return fetchAPI(`/scheduling/conflicts/${scheduleId}`);
  }
}