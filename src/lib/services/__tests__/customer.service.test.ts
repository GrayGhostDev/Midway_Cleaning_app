import { CustomerService } from '../customer.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('CustomerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bookService', () => {
    it('should create a service booking', async () => {
      const bookingData = {
        serviceType: 'Deep Cleaning',
        location: '123 Main St',
        date: '2024-03-01',
        time: '10:00',
        notes: 'Front entrance key under mat',
      };
      const mockResponse = { id: 1, ...bookingData, status: 'Pending' };
      mockFetchAPI.mockResolvedValue(mockResponse);

      const result = await CustomerService.bookService(bookingData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/customer/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      expect(result.status).toBe('Pending');
    });
  });

  describe('getServiceHistory', () => {
    it('should fetch service history', async () => {
      const mockHistory = [
        { id: 1, type: 'Regular Cleaning', location: 'Office A', date: '2024-01-15', time: '09:00', status: 'Completed', rating: 5 },
      ];
      mockFetchAPI.mockResolvedValue(mockHistory);

      const result = await CustomerService.getServiceHistory();

      expect(mockFetchAPI).toHaveBeenCalledWith('/customer/history');
      expect(result).toEqual(mockHistory);
    });
  });

  describe('submitFeedback', () => {
    it('should submit feedback for a booking', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await CustomerService.submitFeedback(1, 5, 'Excellent service!');

      expect(mockFetchAPI).toHaveBeenCalledWith('/customer/feedback/1', {
        method: 'POST',
        body: JSON.stringify({ rating: 5, feedback: 'Excellent service!' }),
      });
    });
  });

  describe('getDocuments', () => {
    it('should fetch customer documents', async () => {
      const mockDocs = [
        { id: 1, name: 'Contract.pdf', type: 'pdf', date: '2024-01-01', size: '2MB', category: 'Contracts' },
      ];
      mockFetchAPI.mockResolvedValue(mockDocs);

      const result = await CustomerService.getDocuments();

      expect(mockFetchAPI).toHaveBeenCalledWith('/customer/documents');
      expect(result).toEqual(mockDocs);
    });
  });

  describe('getMessages', () => {
    it('should fetch customer messages', async () => {
      const mockMessages = [
        { id: 1, sender: { name: 'Support', role: 'admin' }, content: 'Hello!', timestamp: '2024-02-01T10:00:00Z', isCustomer: false },
      ];
      mockFetchAPI.mockResolvedValue(mockMessages);

      const result = await CustomerService.getMessages();

      expect(mockFetchAPI).toHaveBeenCalledWith('/customer/messages');
      expect(result).toEqual(mockMessages);
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const mockResponse = {
        id: 2,
        sender: { name: 'Customer', role: 'client' },
        content: 'When is my next service?',
        timestamp: '2024-02-01T11:00:00Z',
        isCustomer: true,
      };
      mockFetchAPI.mockResolvedValue(mockResponse);

      const result = await CustomerService.sendMessage('When is my next service?');

      expect(mockFetchAPI).toHaveBeenCalledWith('/customer/messages', {
        method: 'POST',
        body: JSON.stringify({ content: 'When is my next service?' }),
      });
      expect(result.isCustomer).toBe(true);
    });
  });
});
