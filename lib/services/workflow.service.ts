import { fetchAPI } from './api';

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  steps: Array<{
    id: number;
    name: string;
    type: 'task' | 'approval' | 'notification';
    config: Record<string, any>;
    dependencies: number[];
  }>;
  triggers: Array<{
    event: string;
    conditions: Record<string, any>;
  }>;
}

export interface WorkflowInstance {
  id: number;
  templateId: number;
  status: 'active' | 'completed' | 'failed';
  currentStep: number;
  progress: {
    completedSteps: number[];
    pendingSteps: number[];
    currentAssignees: number[];
  };
  data: Record<string, any>;
}

export class WorkflowService {
  static async getTemplates(): Promise<WorkflowTemplate[]> {
    return fetchAPI<WorkflowTemplate[]>('/workflows/templates');
  }

  static async createTemplate(template: Omit<WorkflowTemplate, 'id'>): Promise<WorkflowTemplate> {
    return fetchAPI<WorkflowTemplate>('/workflows/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  static async startWorkflow(templateId: number, initialData: Record<string, any>): Promise<WorkflowInstance> {
    return fetchAPI<WorkflowInstance>('/workflows/instances', {
      method: 'POST',
      body: JSON.stringify({ templateId, data: initialData }),
    });
  }

  static async completeStep(instanceId: number, stepId: number, data: Record<string, any>): Promise<WorkflowInstance> {
    return fetchAPI<WorkflowInstance>(`/workflows/instances/${instanceId}/steps/${stepId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getActiveWorkflows(): Promise<WorkflowInstance[]> {
    return fetchAPI<WorkflowInstance[]>('/workflows/instances?status=active');
  }
}