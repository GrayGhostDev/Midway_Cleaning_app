import { fetchAPI } from './api';

export interface ReportTemplate {
  id: number;
  name: string;
  type: 'Performance' | 'Financial' | 'Quality' | 'Inventory' | 'Custom';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  recipients: string[];
  parameters: Record<string, any>;
}

export interface GeneratedReport {
  id: number;
  templateId: number;
  generatedDate: string;
  fileUrl: string;
  status: 'Generated' | 'Failed';
  metadata: {
    periodStart: string;
    periodEnd: string;
    generatedBy: string;
  };
}

export class ReportService {
  static async getTemplates(): Promise<ReportTemplate[]> {
    return fetchAPI<ReportTemplate[]>('/reports/templates');
  }

  static async createTemplate(template: Omit<ReportTemplate, 'id'>): Promise<ReportTemplate> {
    return fetchAPI<ReportTemplate>('/reports/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  static async generateReport(templateId: number, parameters: Record<string, any>): Promise<GeneratedReport> {
    return fetchAPI<GeneratedReport>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ templateId, parameters }),
    });
  }

  static async getReportHistory(filters: {
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<GeneratedReport[]> {
    const params = new URLSearchParams(filters as Record<string, string>);
    return fetchAPI<GeneratedReport[]>(`/reports/history?${params}`);
  }

  static async scheduleReport(templateId: number, schedule: {
    frequency: ReportTemplate['frequency'];
    startDate: string;
    recipients: string[];
  }): Promise<void> {
    return fetchAPI<void>('/reports/schedule', {
      method: 'POST',
      body: JSON.stringify({ templateId, ...schedule }),
    });
  }
}