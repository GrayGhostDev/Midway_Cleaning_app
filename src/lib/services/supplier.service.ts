import { fetchAPI } from './api';

export interface Supplier {
  id: number;
  name: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  category: string[];
  status: 'Active' | 'Inactive' | 'Under Review';
  rating: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contracts: {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    value: number;
    status: string;
  }[];
  performance: {
    deliveryTime: number;
    quality: number;
    communication: number;
    pricing: number;
  };
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  items: {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  status: 'Draft' | 'Pending' | 'Approved' | 'Delivered' | 'Cancelled';
  orderDate: string;
  deliveryDate?: string;
  total: number;
  notes?: string;
  attachments?: {
    id: number;
    name: string;
    url: string;
  }[];
}

export interface SupplierEvaluation {
  id: number;
  supplierId: number;
  evaluator: {
    id: number;
    name: string;
    role: string;
  };
  date: string;
  criteria: {
    category: string;
    score: number;
    weight: number;
    comments: string;
  }[];
  overallScore: number;
  recommendations: string;
  nextReviewDate: string;
}

export class SupplierService {
  static async getSuppliers(params?: {
    category?: string;
    status?: string;
    minRating?: number;
  }): Promise<Supplier[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<Supplier[]>(`/suppliers?${queryParams}`);
  }

  static async getSupplierById(id: number): Promise<Supplier> {
    return fetchAPI<Supplier>(`/suppliers/${id}`);
  }

  static async createSupplier(data: Omit<Supplier, 'id' | 'rating' | 'performance'>): Promise<Supplier> {
    return fetchAPI<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getPurchaseOrders(params?: {
    supplierId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PurchaseOrder[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI<PurchaseOrder[]>(`/suppliers/purchase-orders?${queryParams}`);
  }

  static async createPurchaseOrder(data: Omit<PurchaseOrder, 'id' | 'status' | 'total'>): Promise<PurchaseOrder> {
    return fetchAPI<PurchaseOrder>('/suppliers/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateOrderStatus(
    id: number,
    status: PurchaseOrder['status'],
    notes?: string
  ): Promise<PurchaseOrder> {
    return fetchAPI<PurchaseOrder>(`/suppliers/purchase-orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  static async evaluateSupplier(data: Omit<SupplierEvaluation, 'id' | 'overallScore'>): Promise<SupplierEvaluation> {
    return fetchAPI<SupplierEvaluation>('/suppliers/evaluations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getSupplierPerformance(supplierId: number, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    metrics: Supplier['performance'];
    trends: {
      date: string;
      metrics: Supplier['performance'];
    }[];
  }> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return fetchAPI(`/suppliers/${supplierId}/performance?${queryParams}`);
  }
}