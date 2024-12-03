import { fetchAPI } from './api';

export interface DashboardMetrics {
  activeTasks: number;
  employeesOnDuty: number;
  completedToday: number;
  customerRating: number;
  trends: {
    tasks: string;
    employees: string;
    completion: string;
    rating: string;
  };
}

export interface PerformanceData {
  month: string;
  taskCompletion: number;
  efficiency: number;
  quality: number;
}

export interface CostData {
  category: string;
  actual: number;
  projected: number;
}

export interface SatisfactionData {
  month: string;
  rating: number;
  responses: number;
}

export interface ResourceData {
  subject: string;
  current: number;
  optimal: number;
}

export class AnalyticsService {
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    return fetchAPI<DashboardMetrics>('/analytics/dashboard');
  }

  static async getPerformanceData(): Promise<PerformanceData[]> {
    return fetchAPI<PerformanceData[]>('/analytics/performance');
  }

  static async getCostAnalysis(): Promise<CostData[]> {
    return fetchAPI<CostData[]>('/analytics/costs');
  }

  static async getSatisfactionTrends(): Promise<SatisfactionData[]> {
    return fetchAPI<SatisfactionData[]>('/analytics/satisfaction');
  }

  static async getResourceUtilization(): Promise<ResourceData[]> {
    return fetchAPI<ResourceData[]>('/analytics/resources');
  }

  static async generateReport(type: string, dateRange: { start: string; end: string }): Promise<string> {
    return fetchAPI<string>('/analytics/report', {
      method: 'POST',
      body: JSON.stringify({ type, dateRange }),
    });
  }
}