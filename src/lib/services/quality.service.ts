import { fetchAPI } from './api';

export interface Inspection {
  id: number;
  location: string;
  inspector: {
    id: number;
    name: string;
    image: string;
  };
  date: string;
  score?: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  items?: {
    passed: number;
    total: number;
  };
  type: 'Regular' | 'Detailed' | 'Follow-up';
}

export interface CreateInspectionDTO {
  locationId: number;
  inspectorId: number;
  date: string;
  type: Inspection['type'];
  checklistItems: string[];
}

export interface InspectionResult {
  itemId: string;
  passed: boolean;
  notes?: string;
  images?: string[];
}

export class QualityService {
  static async getInspections(): Promise<Inspection[]> {
    return fetchAPI<Inspection[]>('/inspections');
  }

  static async getInspectionById(id: number): Promise<Inspection> {
    return fetchAPI<Inspection>(`/inspections/${id}`);
  }

  static async createInspection(data: CreateInspectionDTO): Promise<Inspection> {
    return fetchAPI<Inspection>('/inspections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async submitResults(id: number, results: InspectionResult[]): Promise<Inspection> {
    return fetchAPI<Inspection>(`/inspections/${id}/results`, {
      method: 'POST',
      body: JSON.stringify({ results }),
    });
  }

  static async getMetrics(): Promise<{
    overallScore: number;
    passRate: number;
    satisfaction: number;
    compliance: number;
  }> {
    return fetchAPI('/quality/metrics');
  }
}