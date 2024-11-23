import { fetchAPI } from './api';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  location: string;
  dueDate: string;
  assignee: {
    id: number;
    name: string;
    image: string;
  };
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  priority: Task['priority'];
  location: string;
  assigneeId: number;
  dueDate: string;
}

export class TaskService {
  static async getAll(): Promise<Task[]> {
    return fetchAPI<Task[]>('/tasks');
  }

  static async getById(id: number): Promise<Task> {
    return fetchAPI<Task>(`/tasks/${id}`);
  }

  static async create(data: CreateTaskDTO): Promise<Task> {
    return fetchAPI<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateStatus(id: number, status: Task['status']): Promise<Task> {
    return fetchAPI<Task>(`/tasks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  static async delete(id: number): Promise<void> {
    return fetchAPI<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}