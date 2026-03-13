import { InventoryService } from '../inventory.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('InventoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItem = {
    id: 1,
    name: 'Glass Cleaner',
    category: 'Cleaning Supplies',
    quantity: 50,
    minQuantity: 10,
    unit: 'bottles',
    location: 'Storage Room A',
    lastRestocked: '2024-01-15',
    status: 'In Stock' as const,
  };

  describe('getAll', () => {
    it('should fetch all inventory items', async () => {
      mockFetchAPI.mockResolvedValue([mockItem]);

      const result = await InventoryService.getAll();

      expect(mockFetchAPI).toHaveBeenCalledWith('/inventory');
      expect(result).toEqual([mockItem]);
    });
  });

  describe('getById', () => {
    it('should fetch inventory item by ID', async () => {
      mockFetchAPI.mockResolvedValue(mockItem);

      const result = await InventoryService.getById(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/inventory/1');
      expect(result).toEqual(mockItem);
    });
  });

  describe('create', () => {
    it('should create a new inventory item', async () => {
      const createData = {
        name: 'Glass Cleaner',
        category: 'Cleaning Supplies',
        quantity: 50,
        minQuantity: 10,
        unit: 'bottles',
        location: 'Storage Room A',
      };
      mockFetchAPI.mockResolvedValue(mockItem);

      const result = await InventoryService.create(createData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/inventory', {
        method: 'POST',
        body: JSON.stringify(createData),
      });
      expect(result).toEqual(mockItem);
    });
  });

  describe('updateStock', () => {
    it('should update stock quantity', async () => {
      const updatedItem = { ...mockItem, quantity: 75 };
      mockFetchAPI.mockResolvedValue(updatedItem);

      const result = await InventoryService.updateStock(1, 75);

      expect(mockFetchAPI).toHaveBeenCalledWith('/inventory/1/stock', {
        method: 'PUT',
        body: JSON.stringify({ quantity: 75 }),
      });
      expect(result.quantity).toBe(75);
    });
  });

  describe('delete', () => {
    it('should delete an inventory item', async () => {
      mockFetchAPI.mockResolvedValue(undefined);

      await InventoryService.delete(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/inventory/1', {
        method: 'DELETE',
      });
    });
  });
});
