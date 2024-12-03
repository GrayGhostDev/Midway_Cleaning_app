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
    return fetchAPI<Equipment[]>(`/api/equipment?${params}`);
  }

  static async getEquipmentById(id: number): Promise<Equipment> {
    return fetchAPI<Equipment>(`/api/equipment/${id}`);
  }

  static async updateStatus(id: number, status: Equipment['status']): Promise<void> {
    return fetchAPI<void>(`/api/equipment/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  static async addEquipment(equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
    return fetchAPI<Equipment>('/api/equipment', {
      method: 'POST',
      body: JSON.stringify(equipment),
    });
  }

  static async updateEquipment(id: number, equipment: Partial<Equipment>): Promise<Equipment> {
    return fetchAPI<Equipment>(`/api/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipment),
    });
  }

  static async deleteEquipment(id: number): Promise<void> {
    return fetchAPI<void>(`/api/equipment/${id}`, {
      method: 'DELETE',
    });
  }

  static async addMaintenanceRecord(
    equipmentId: number,
    record: Omit<MaintenanceRecord, 'id' | 'equipmentId'>
  ): Promise<MaintenanceRecord> {
    return fetchAPI<MaintenanceRecord>(`/api/equipment/${equipmentId}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  static async getMaintenanceSchedule(equipmentId: number): Promise<MaintenanceSchedule> {
    return fetchAPI<MaintenanceSchedule>(`/api/equipment/${equipmentId}/maintenance/schedule`);
  }
}