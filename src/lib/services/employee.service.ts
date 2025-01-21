import { fetchAPI } from './api';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  location?: string;
}

export interface CreateEmployeeDTO {
  name: string;
  email: string;
  role: string;
  status: string;
  location?: string;
}

export class EmployeeService {
  static async getAll(): Promise<Employee[]> {
    return fetchAPI<Employee[]>('/employees');
  }

  static async getById(id: string): Promise<Employee> {
    return fetchAPI<Employee>(`/employees/${id}`);
  }

  static async create(employee: CreateEmployeeDTO): Promise<Employee> {
    return fetchAPI<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  static async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    return fetchAPI<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  static async delete(id: string): Promise<void> {
    return fetchAPI<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }
}