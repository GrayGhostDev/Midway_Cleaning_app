import { fetchAPI } from './api';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  image: string;
  performance: number;
  status: string;
  location: string;
}

export interface CreateEmployeeDTO {
  name: string;
  email: string;
  role: string;
  location: string;
}

export class EmployeeService {
  static async getAll(): Promise<Employee[]> {
    return fetchAPI<Employee[]>('/employees');
  }

  static async getById(id: number): Promise<Employee> {
    return fetchAPI<Employee>(`/employees/${id}`);
  }

  static async create(data: CreateEmployeeDTO): Promise<Employee> {
    return fetchAPI<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async update(id: number, data: Partial<CreateEmployeeDTO>): Promise<Employee> {
    return fetchAPI<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(id: number): Promise<void> {
    return fetchAPI<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }
}