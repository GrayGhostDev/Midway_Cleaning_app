import { BillingService } from '../billing.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('BillingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice with correct data', async () => {
      const invoiceData = {
        clientId: 1,
        amount: 500,
        dueDate: '2024-03-01',
        items: [
          { description: 'Deep cleaning', quantity: 2, rate: 250, amount: 500 },
        ],
        payments: [],
      };
      const mockResponse = { id: 1, status: 'draft', ...invoiceData };
      mockFetchAPI.mockResolvedValue(mockResponse);

      const result = await BillingService.createInvoice(invoiceData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/billing/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should propagate API errors', async () => {
      mockFetchAPI.mockRejectedValue(new Error('API Error'));

      await expect(
        BillingService.createInvoice({
          clientId: 1,
          amount: 0,
          dueDate: '',
          items: [],
          payments: [],
        })
      ).rejects.toThrow('API Error');
    });
  });

  describe('getInvoices', () => {
    it('should fetch invoices without filters', async () => {
      const mockInvoices = [{ id: 1, clientId: 1, amount: 500, status: 'paid' }];
      mockFetchAPI.mockResolvedValue(mockInvoices);

      const result = await BillingService.getInvoices();

      expect(mockFetchAPI).toHaveBeenCalledWith(expect.stringContaining('/billing/invoices'));
      expect(result).toEqual(mockInvoices);
    });

    it('should fetch invoices with filters', async () => {
      mockFetchAPI.mockResolvedValue([]);

      await BillingService.getInvoices({ clientId: 1, status: 'paid' });

      expect(mockFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('clientId=1')
      );
    });
  });

  describe('recordPayment', () => {
    it('should record a payment for an invoice', async () => {
      const payment = { date: '2024-02-15', amount: 250, method: 'credit_card', reference: 'ref_123' };
      const mockUpdated = { id: 1, status: 'paid', payments: [{ id: 1, ...payment }] };
      mockFetchAPI.mockResolvedValue(mockUpdated);

      const result = await BillingService.recordPayment(1, payment);

      expect(mockFetchAPI).toHaveBeenCalledWith('/billing/invoices/1/payments', {
        method: 'POST',
        body: JSON.stringify(payment),
      });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('getServiceRates', () => {
    it('should fetch service rates', async () => {
      const mockRates = [{ id: 1, name: 'Standard Cleaning', rate: 50, unit: 'hour' }];
      mockFetchAPI.mockResolvedValue(mockRates);

      const result = await BillingService.getServiceRates();

      expect(mockFetchAPI).toHaveBeenCalledWith(expect.stringContaining('/billing/rates'));
      expect(result).toEqual(mockRates);
    });

    it('should fetch rates filtered by client', async () => {
      mockFetchAPI.mockResolvedValue([]);

      await BillingService.getServiceRates({ clientId: 5 });

      expect(mockFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('clientId=5')
      );
    });
  });

  describe('generateReport', () => {
    it('should generate a billing report', async () => {
      const params = { type: 'revenue' as const, startDate: '2024-01-01', endDate: '2024-01-31' };
      const mockReport = {
        summary: { totalRevenue: 10000, totalPayments: 8000 },
        details: [{ date: '2024-01-15', amount: 500 }],
      };
      mockFetchAPI.mockResolvedValue(mockReport);

      const result = await BillingService.generateReport(params);

      expect(mockFetchAPI).toHaveBeenCalledWith('/billing/reports', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      expect(result).toEqual(mockReport);
    });
  });
});
