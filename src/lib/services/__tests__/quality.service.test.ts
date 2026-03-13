import { QualityService } from '../quality.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('QualityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockInspection = {
    id: 1,
    location: 'Office Complex A',
    inspector: { id: 1, name: 'Mike Johnson', image: '/img/mike.png' },
    date: '2024-02-15',
    score: 95,
    status: 'Completed' as const,
    items: { passed: 19, total: 20 },
    type: 'Regular' as const,
  };

  describe('getInspections', () => {
    it('should fetch all inspections', async () => {
      mockFetchAPI.mockResolvedValue([mockInspection]);

      const result = await QualityService.getInspections();

      expect(mockFetchAPI).toHaveBeenCalledWith('/inspections');
      expect(result).toEqual([mockInspection]);
    });
  });

  describe('getInspectionById', () => {
    it('should fetch inspection by ID', async () => {
      mockFetchAPI.mockResolvedValue(mockInspection);

      const result = await QualityService.getInspectionById(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/inspections/1');
      expect(result).toEqual(mockInspection);
    });
  });

  describe('createInspection', () => {
    it('should create a new inspection', async () => {
      const inspectionData = {
        locationId: 1,
        inspectorId: 1,
        date: '2024-03-01',
        type: 'Regular' as const,
        checklistItems: ['Floors', 'Windows', 'Restrooms'],
      };
      mockFetchAPI.mockResolvedValue({ id: 2, ...inspectionData, status: 'Scheduled' });

      const result = await QualityService.createInspection(inspectionData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/inspections', {
        method: 'POST',
        body: JSON.stringify(inspectionData),
      });
      expect(result.id).toBe(2);
    });
  });

  describe('submitResults', () => {
    it('should submit inspection results', async () => {
      const results = [
        { itemId: 'floors', passed: true },
        { itemId: 'windows', passed: true },
        { itemId: 'restrooms', passed: false, notes: 'Needs deep clean' },
      ];
      mockFetchAPI.mockResolvedValue({ ...mockInspection, score: 67 });

      const result = await QualityService.submitResults(1, results);

      expect(mockFetchAPI).toHaveBeenCalledWith('/inspections/1/results', {
        method: 'POST',
        body: JSON.stringify({ results }),
      });
      expect(result.score).toBe(67);
    });
  });

  describe('getMetrics', () => {
    it('should fetch quality metrics', async () => {
      const mockMetrics = {
        overallScore: 92,
        passRate: 0.95,
        satisfaction: 4.5,
        compliance: 0.98,
      };
      mockFetchAPI.mockResolvedValue(mockMetrics);

      const result = await QualityService.getMetrics();

      expect(mockFetchAPI).toHaveBeenCalledWith('/quality/metrics');
      expect(result).toEqual(mockMetrics);
    });
  });
});
