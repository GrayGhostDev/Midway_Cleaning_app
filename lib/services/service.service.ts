import { fetchAPI } from './api';

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: string;
  rate: number;
  rateUnit: 'hour' | 'visit' | 'sqft';
  staffRequired: number;
  status: 'Active' | 'Under Review' | 'Discontinued';
  utilization: number;
  lastUpdated: string;
  requirements: {
    equipment: string[];
    supplies: string[];
    certifications: string[];
  };
  checklist: {
    id: string;
    task: string;
    required: boolean;
  }[];
}

export interface ServicePackage {
  id: number;
  name: string;
  services: Array<{
    serviceId: number;
    frequency: string;
    customizations?: Record<string, any>;
  }>;
  pricing: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  discounts?: {
    type: string;
    value: number;
    conditions?: string;
  }[];
}

export class ServiceService {
  static async getAllServices(): Promise<Service[]> {
    return fetchAPI<Service[]>('/services');
  }

  static async getServiceById(id: number): Promise<Service> {
    return fetchAPI<Service>(`/services/${id}`);
  }

  static async createService(data: Omit<Service, 'id' | 'utilization' | 'lastUpdated'>): Promise<Service> {
    return fetchAPI<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateService(id: number, data: Partial<Service>): Promise<Service> {
    return fetchAPI<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async getServicePackages(): Promise<ServicePackage[]> {
    return fetchAPI<ServicePackage[]>('/services/packages');
  }

  static async createServicePackage(data: Omit<ServicePackage, 'id'>): Promise<ServicePackage> {
    return fetchAPI<ServicePackage>('/services/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getServiceMetrics(): Promise<{
    totalActive: number;
    averageUtilization: number;
    popularServices: Array<{ id: number; name: string; bookings: number }>;
    revenueByService: Array<{ id: number; name: string; revenue: number }>;
  }> {
    return fetchAPI('/services/metrics');
  }

  static async getServiceAvailability(
    serviceId: number,
    date: string
  ): Promise<Array<{
    time: string;
    available: boolean;
    reason?: string;
  }>> {
    return fetchAPI(`/services/${serviceId}/availability?date=${date}`);
  }
}