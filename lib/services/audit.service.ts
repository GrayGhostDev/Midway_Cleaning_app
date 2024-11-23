import { fetchAPI } from './api';

export interface AuditLog {
  id: number;
  timestamp: string;
  action: string;
  module: string;
  userId: number;
  userDetails: {
    name: string;
    role: string;
  };
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

export interface AuditSummary {
  totalActions: number;
  userActivity: {
    userId: number;
    userName: string;
    actionCount: number;
  }[];
  moduleActivity: Record<string, number>;
  timeDistribution: {
    hour: number;
    count: number;
  }[];
}

export class AuditService {
  static async getLogs(params?: {
    startDate?: string;
    endDate?: string;
    module?: string;
    userId?: number;
    action?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: AuditLog[];
    total: number;
  }> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI(`/audit/logs?${queryParams}`);
  }

  static async getLogById(id: number): Promise<AuditLog> {
    return fetchAPI<AuditLog>(`/audit/logs/${id}`);
  }

  static async getSummary(params: {
    startDate: string;
    endDate: string;
  }): Promise<AuditSummary> {
    const queryParams = new URLSearchParams(params);
    return fetchAPI<AuditSummary>(`/audit/summary?${queryParams}`);
  }

  static async exportLogs(params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'pdf' | 'excel';
  }): Promise<{ url: string }> {
    return fetchAPI<{ url: string }>('/audit/export', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async searchLogs(query: string): Promise<AuditLog[]> {
    return fetchAPI<AuditLog[]>(`/audit/search?q=${encodeURIComponent(query)}`);
  }
}