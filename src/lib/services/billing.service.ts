import { fetchAPI } from './api';

export interface Invoice {
  id: number;
  clientId: number;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  payments: Array<{
    id: number;
    date: string;
    amount: number;
    method: string;
    reference: string;
  }>;
}

export interface ServiceRate {
  id: number;
  name: string;
  rate: number;
  unit: 'hour' | 'visit' | 'sqft';
  clientId?: number;
  locationId?: number;
  minimumCharge?: number;
}

export class BillingService {
  static async createInvoice(data: Omit<Invoice, 'id' | 'status'>): Promise<Invoice> {
    return fetchAPI<Invoice>('/billing/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getInvoices(params?: {
    clientId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Invoice[]> {
    const queryParams = new URLSearchParams(params as Record<string, any>);
    return fetchAPI<Invoice[]>(`/billing/invoices?${queryParams}`);
  }

  static async recordPayment(
    invoiceId: number,
    payment: Omit<Invoice['payments'][0], 'id'>
  ): Promise<Invoice> {
    return fetchAPI<Invoice>(`/billing/invoices/${invoiceId}/payments`, {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  static async getServiceRates(params?: {
    clientId?: number;
    locationId?: number;
  }): Promise<ServiceRate[]> {
    const queryParams = new URLSearchParams(params as Record<string, any>);
    return fetchAPI<ServiceRate[]>(`/billing/rates?${queryParams}`);
  }

  static async generateReport(params: {
    type: 'revenue' | 'receivables' | 'payments';
    startDate: string;
    endDate: string;
  }): Promise<{
    summary: Record<string, number>;
    details: Record<string, any>[];
  }> {
    return fetchAPI('/billing/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}