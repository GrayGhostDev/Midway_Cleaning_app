import { fetchAPI } from './api';

export interface ComplianceRequirement {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending Review';
  dueDate: string;
  assignedTo: {
    id: number;
    name: string;
    role: string;
  };
  documents: {
    id: number;
    name: string;
    url: string;
    uploadDate: string;
  }[];
  lastReviewDate: string;
  nextReviewDate: string;
  notes?: string;
}

export interface ComplianceAudit {
  id: number;
  type: 'Internal' | 'External';
  auditor: string;
  date: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  findings: {
    id: number;
    category: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    action: string;
    dueDate: string;
    status: string;
  }[];
  score?: number;
  report?: string;
}

export interface ComplianceTraining {
  id: number;
  title: string;
  description: string;
  requiredFor: string[];
  validityPeriod: number;
  completions: {
    employeeId: number;
    completionDate: string;
    expiryDate: string;
    score?: number;
  }[];
}

export class ComplianceService {
  static async getRequirements(params?: {
    category?: string;
    status?: string;
  }): Promise<ComplianceRequirement[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<ComplianceRequirement[]>(`/compliance/requirements?${queryParams}`);
  }

  static async updateRequirementStatus(
    id: number,
    status: ComplianceRequirement['status'],
    notes?: string
  ): Promise<ComplianceRequirement> {
    return fetchAPI<ComplianceRequirement>(`/compliance/requirements/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  static async getAudits(params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ComplianceAudit[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<ComplianceAudit[]>(`/compliance/audits?${queryParams}`);
  }

  static async scheduleAudit(data: Omit<ComplianceAudit, 'id' | 'findings' | 'score' | 'report'>): Promise<ComplianceAudit> {
    return fetchAPI<ComplianceAudit>('/compliance/audits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getTrainingStatus(employeeId?: number): Promise<ComplianceTraining[]> {
    const params = employeeId ? `?employeeId=${employeeId}` : '';
    return fetchAPI<ComplianceTraining[]>(`/compliance/training${params}`);
  }

  static async generateComplianceReport(params: {
    startDate: string;
    endDate: string;
    categories?: string[];
  }): Promise<{ url: string }> {
    return fetchAPI<{ url: string }>('/compliance/report', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}