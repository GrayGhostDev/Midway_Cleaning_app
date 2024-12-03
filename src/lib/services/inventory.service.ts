import { fetchAPI } from './api';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  location: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface CreateInventoryItemDTO {
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  location: string;
}

export class InventoryService {
  static async getAll(): Promise<InventoryItem[]> {
    return fetchAPI<InventoryItem[]>('/inventory');
  }

  static async getById(id: number): Promise<InventoryItem> {
    return fetchAPI<InventoryItem>(`/inventory/${id}`);
  }

  static async create(data: CreateInventoryItemDTO): Promise<InventoryItem> {
    return fetchAPI<InventoryItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateStock(id: number, quantity: number): Promise<InventoryItem> {
    return fetchAPI<InventoryItem>(`/inventory/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  static async delete(id: number): Promise<void> {
    return fetchAPI<void>(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }
}