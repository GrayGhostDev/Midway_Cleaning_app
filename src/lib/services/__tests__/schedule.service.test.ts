import { ScheduleService } from '../schedule.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('ScheduleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getShifts', () => {
    it('should fetch shifts for a given date', async () => {
      const mockShifts = [
        {
          id: 1,
          employee: { id: 1, name: 'John Doe', image: '/img/john.png' },
          location: 'Office A',
          startTime: '09:00',
          endTime: '17:00',
          status: 'Scheduled',
          type: 'Regular',
        },
      ];
      mockFetchAPI.mockResolvedValue(mockShifts);

      const result = await ScheduleService.getShifts('2024-02-01');

      expect(mockFetchAPI).toHaveBeenCalledWith('/shifts?date=2024-02-01');
      expect(result).toEqual(mockShifts);
    });
  });

  describe('getShiftById', () => {
    it('should fetch a single shift by ID', async () => {
      const mockShift = {
        id: 1,
        employee: { id: 1, name: 'John Doe', image: '/img/john.png' },
        location: 'Office A',
        startTime: '09:00',
        endTime: '17:00',
        status: 'Scheduled',
        type: 'Regular',
      };
      mockFetchAPI.mockResolvedValue(mockShift);

      const result = await ScheduleService.getShiftById(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/shifts/1');
      expect(result).toEqual(mockShift);
    });
  });

  describe('createShift', () => {
    it('should create a new shift', async () => {
      const shiftData = {
        employeeId: 1,
        locationId: 2,
        startTime: '09:00',
        endTime: '17:00',
        type: 'Regular' as const,
      };
      const mockResponse = { id: 1, ...shiftData, status: 'Scheduled' };
      mockFetchAPI.mockResolvedValue(mockResponse);

      const result = await ScheduleService.createShift(shiftData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/shifts', {
        method: 'POST',
        body: JSON.stringify(shiftData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateShiftStatus', () => {
    it('should update shift status', async () => {
      const mockResponse = { id: 1, status: 'Completed' };
      mockFetchAPI.mockResolvedValue(mockResponse);

      const result = await ScheduleService.updateShiftStatus(1, 'Completed');

      expect(mockFetchAPI).toHaveBeenCalledWith('/shifts/1/status', {
        method: 'PUT',
        body: JSON.stringify({ status: 'Completed' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteShift', () => {
    it('should delete a shift', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await ScheduleService.deleteShift(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/shifts/1', {
        method: 'DELETE',
      });
    });
  });
});
