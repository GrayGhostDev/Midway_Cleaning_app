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
    try {
      const response = await fetchAPI<Employee[]>('/employees', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Failed to load employees:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Employee> {
    try {
      const response = await fetchAPI<Employee>(`/employees/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error(`Failed to load employee ${id}:`, error);
      throw error;
    }
  }

  static async create(employee: CreateEmployeeDTO): Promise<Employee> {
    try {
      const response = await fetchAPI<Employee>('/employees', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      return response;
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw error;
    }
  }

  static async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    try {
      const response = await fetchAPI<Employee>(`/employees/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      return response;
    } catch (error) {
      console.error(`Failed to update employee ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await fetchAPI<void>(`/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Failed to delete employee ${id}:`, error);
      throw error;
    }
  }
}