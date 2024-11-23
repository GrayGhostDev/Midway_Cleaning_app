import { fetchAPI } from './api';

export interface Equipment {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired';
  location: string;
  assignedTo?: {
    id: number;
    name: string;
  };
  maintenanceHistory: MaintenanceRecord[];
  specifications: Record<string, any>;
}

export interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  type: 'Routine' | 'Repair' | 'Inspection';
  date: string;
  description: string;
  cost: number;
  performedBy: string;
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface MaintenanceSchedule {
  id: number;
  equipmentId: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  lastPerformed?: string;
  nextDue: string;
  tasks: string[];
  assignedTo?: number;
}

export class EquipmentService {
  static async getAllEquipment(filters?: {
    type?: string;
    status?: string;
    location?: string;
  }): Promise<Equipment[]> {
    const params = new URLSearchParams(filters as Record<string, string>);
    return fetchAPI<Equipment[]>(`/equipment?${params}`);
  }

  static async getEquipmentById(id: number): Promise<Equipment> {
    return fetchAPI<Equipment>(`/equipment/${id}`);
  }

  static async createEquipment(data: Omit<Equipment, 'id' | 'maintenanceHistory'>): Promise<Equipment> {
    return fetchAPI<Equipment>('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateStatus(id: number, status: Equipment['status'], notes?: string): Promise<Equipment> {
    return fetchAPI<Equipment>(`/equipment/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  static async assignEquipment(id: number, employeeId: number): Promise<Equipment> {
    return fetchAPI<Equipment>(`/equipment/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ employeeId }),
    });
  }

  static async addMaintenanceRecord(
    equipmentId: number,
    record: Omit<MaintenanceRecord, 'id' | 'equipmentId'>
  ): Promise<MaintenanceRecord> {
    return fetchAPI<MaintenanceRecord>(`/equipment/${equipmentId}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  static async getMaintenanceSchedule(equipmentId: number): Promise<MaintenanceSchedule> {
    return fetchAPI<MaintenanceSchedule>(`/equipment/${equipmentId}/schedule`);
  }

  static async updateMaintenanceSchedule(
    equipmentId: number,
    schedule: Partial<MaintenanceSchedule>
  ): Promise<MaintenanceSchedule> {
    return fetchAPI<MaintenanceSchedule>(`/equipment/${equipmentId}/schedule`, {
      method: 'PUT',
      body: JSON.stringify(schedule),
    });
  }

  static async generateMaintenanceReport(params: {
    startDate: string;
    endDate: string;
    type?: MaintenanceRecord['type'];
  }): Promise<{
    totalCost: number;
    recordCount: number;
    records: MaintenanceRecord[];
    summary: Record<string, number>;
  }> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI(`/equipment/maintenance/report?${queryParams}`);
  }
}