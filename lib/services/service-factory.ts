import { ServiceService } from './service.service';
import { mockServices, mockServicePackages, mockBookings } from './mock-data';

class ServiceFactory {
  private static instance: ServiceFactory;
  private useMockData: boolean;

  private constructor() {
    this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  getServiceService() {
    if (this.useMockData) {
      return {
        getAllServices: async () => mockServices,
        getServiceById: async (id: number) => mockServices.find(s => s.id === id),
        createService: async (data: any) => ({ id: Date.now(), ...data }),
        getServicePackages: async () => mockServicePackages,
        createServicePackage: async (data: any) => ({ id: Date.now(), ...data }),
        getServiceMetrics: async () => ({
          totalActive: mockServices.length,
          averageUtilization: 85,
          popularServices: mockServices.map(s => ({
            id: s.id,
            name: s.name,
            bookings: Math.floor(Math.random() * 50) + 10,
          })),
        }),
      };
    }
    return ServiceService;
  }

  getBookingService() {
    if (this.useMockData) {
      return {
        getBookings: async () => mockBookings,
        createBooking: async (data: any) => ({ id: Date.now(), ...data }),
      };
    }
    return null; // Replace with actual booking service when available
  }
}

export const serviceFactory = ServiceFactory.getInstance();