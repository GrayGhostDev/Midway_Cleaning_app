import { EquipmentService } from '../equipment.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('EquipmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEquipment = {
    id: 1,
    name: 'Floor Buffer',
    type: 'Cleaning Machine',
    serialNumber: 'FB-001',
    manufacturer: 'CleanCo',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2025-01-15',
    status: 'Available' as const,
    location: 'Warehouse A',
    maintenanceHistory: [],
    specifications: { weight: '25kg', power: '1200W' },
  };

  describe('getAllEquipment', () => {
    it('should fetch all equipment', async () => {
      mockFetchAPI.mockResolvedValue([mockEquipment]);

      const result = await EquipmentService.getAllEquipment();

      expect(mockFetchAPI).toHaveBeenCalledWith(expect.stringContaining('/api/equipment'));
      expect(result).toEqual([mockEquipment]);
    });

    it('should fetch equipment with filters', async () => {
      mockFetchAPI.mockResolvedValue([]);

      await EquipmentService.getAllEquipment({ type: 'Cleaning Machine', status: 'Available' });

      expect(mockFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('type=Cleaning')
      );
    });
  });

  describe('getEquipmentById', () => {
    it('should fetch equipment by ID', async () => {
      mockFetchAPI.mockResolvedValue(mockEquipment);

      const result = await EquipmentService.getEquipmentById(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/api/equipment/1');
      expect(result).toEqual(mockEquipment);
    });
  });

  describe('updateStatus', () => {
    it('should update equipment status', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await EquipmentService.updateStatus(1, 'Maintenance');

      expect(mockFetchAPI).toHaveBeenCalledWith('/api/equipment/1/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Maintenance' }),
      });
    });
  });

  describe('addEquipment', () => {
    it('should add new equipment', async () => {
      const { id, ...newEquipment } = mockEquipment;
      mockFetchAPI.mockResolvedValue(mockEquipment);

      const result = await EquipmentService.addEquipment(newEquipment);

      expect(mockFetchAPI).toHaveBeenCalledWith('/api/equipment', {
        method: 'POST',
        body: JSON.stringify(newEquipment),
      });
      expect(result).toEqual(mockEquipment);
    });
  });

  describe('updateEquipment', () => {
    it('should update equipment', async () => {
      const updates = { location: 'Warehouse B' };
      mockFetchAPI.mockResolvedValue({ ...mockEquipment, ...updates });

      const result = await EquipmentService.updateEquipment(1, updates);

      expect(mockFetchAPI).toHaveBeenCalledWith('/api/equipment/1', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      expect(result.location).toBe('Warehouse B');
    });
  });

  describe('deleteEquipment', () => {
    it('should delete equipment', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await EquipmentService.deleteEquipment(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/api/equipment/1', {
        method: 'DELETE',
      });
    });
  });

  describe('addMaintenanceRecord', () => {
    it('should add a maintenance record', async () => {
      const record = {
        type: 'Routine' as const,
        date: '2024-02-01',
        description: 'Monthly checkup',
        cost: 50,
        performedBy: 'Tech Team',
      };
      const mockRecord = { id: 1, equipmentId: 1, ...record };
      mockFetchAPI.mockResolvedValue(mockRecord);

      const result = await EquipmentService.addMaintenanceRecord(1, record);

      expect(mockFetchAPI).toHaveBeenCalledWith('/api/equipment/1/maintenance', {
        method: 'POST',
        body: JSON.stringify(record),
      });
      expect(result).toEqual(mockRecord);
    });
  });

  describe('getMaintenanceSchedule', () => {
    it('should fetch maintenance schedule', async () => {
      const mockSchedule = {
        id: 1,
        equipmentId: 1,
        frequency: 'Monthly',
        nextDue: '2024-03-01',
        tasks: ['Check motor', 'Clean filters'],
      };
      mockFetchAPI.mockResolvedValue(mockSchedule);

      const result = await EquipmentService.getMaintenanceSchedule(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/api/equipment/1/maintenance/schedule');
      expect(result).toEqual(mockSchedule);
    });
  });
});
