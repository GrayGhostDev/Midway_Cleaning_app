import { EmployeeService } from '../employee.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('EmployeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEmployee = {
    id: 'emp_1',
    name: 'Jane Smith',
    email: 'jane@midway.com',
    role: 'cleaner',
    status: 'active',
    location: 'Downtown',
  };

  describe('getAll', () => {
    it('should fetch all employees', async () => {
      mockFetchAPI.mockResolvedValue([mockEmployee]);

      const result = await EmployeeService.getAll();

      expect(mockFetchAPI).toHaveBeenCalledWith('/employees');
      expect(result).toEqual([mockEmployee]);
    });

    it('should return empty array when no employees', async () => {
      mockFetchAPI.mockResolvedValue([]);

      const result = await EmployeeService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch an employee by ID', async () => {
      mockFetchAPI.mockResolvedValue(mockEmployee);

      const result = await EmployeeService.getById('emp_1');

      expect(mockFetchAPI).toHaveBeenCalledWith('/employees/emp_1');
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createData = {
        name: 'Jane Smith',
        email: 'jane@midway.com',
        role: 'cleaner',
        status: 'active',
        location: 'Downtown',
      };
      mockFetchAPI.mockResolvedValue(mockEmployee);

      const result = await EmployeeService.create(createData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/employees', {
        method: 'POST',
        body: JSON.stringify(createData),
      });
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updates = { status: 'inactive' };
      mockFetchAPI.mockResolvedValue({ ...mockEmployee, ...updates });

      const result = await EmployeeService.update('emp_1', updates);

      expect(mockFetchAPI).toHaveBeenCalledWith('/employees/emp_1', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      expect(result.status).toBe('inactive');
    });
  });

  describe('delete', () => {
    it('should delete an employee', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await EmployeeService.delete('emp_1');

      expect(mockFetchAPI).toHaveBeenCalledWith('/employees/emp_1', {
        method: 'DELETE',
      });
    });
  });
});
