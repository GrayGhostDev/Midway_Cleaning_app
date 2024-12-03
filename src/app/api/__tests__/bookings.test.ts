import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { POST, GET } from '../bookings/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { mockEmailService } from '@/test/test-utils';

// Mock Clerk auth
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(),
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
  },
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    service: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Bookings API', () => {
  const mockUserId = 'user_123';
  const mockBookingData = {
    serviceId: 'service_123',
    date: '2024-02-01',
    time: '10:00',
    address: '123 Test St',
    specialInstructions: 'Clean windows thoroughly',
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock authenticated user
    (auth as jest.Mock).mockReturnValue({
      userId: mockUserId,
    });
  });

  describe('POST /api/bookings', () => {
    it('should create a new booking', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: mockBookingData,
      });

      // Mock service existence check
      prisma.service.findUnique.mockResolvedValue({
        id: mockBookingData.serviceId,
        name: 'Deep Cleaning',
        price: 150,
      });

      // Mock booking creation
      prisma.booking.create.mockResolvedValue({
        id: 'booking_123',
        userId: mockUserId,
        ...mockBookingData,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await POST(req as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id', 'booking_123');
      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUserId,
          serviceId: mockBookingData.serviceId,
        }),
      });
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          serviceId: mockBookingData.serviceId,
          // Missing required fields
        },
      });

      const response = await POST(req as unknown as NextRequest);
      expect(response.status).toBe(400);
    });

    it('should handle non-existent service', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: mockBookingData,
      });

      prisma.service.findUnique.mockResolvedValue(null);

      const response = await POST(req as unknown as NextRequest);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/bookings', () => {
    it('should return user bookings', async () => {
      const { req } = createMocks({
        method: 'GET',
        query: {
          status: 'PENDING',
        },
      });

      const mockBookings = [
        {
          id: 'booking_123',
          userId: mockUserId,
          ...mockBookingData,
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prisma.booking.findMany.mockResolvedValue(mockBookings);

      const response = await GET(req as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0]).toHaveProperty('id', 'booking_123');
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          status: 'PENDING',
        },
        include: {
          service: true,
        },
      });
    });

    it('should handle unauthorized access', async () => {
      (auth as jest.Mock).mockReturnValue({
        userId: null,
      });

      const { req } = createMocks({
        method: 'GET',
      });

      const response = await GET(req as unknown as NextRequest);
      expect(response.status).toBe(401);
    });

    it('should handle database errors', async () => {
      const { req } = createMocks({
        method: 'GET',
      });

      prisma.booking.findMany.mockRejectedValue(new Error('Database error'));

      const response = await GET(req as unknown as NextRequest);
      expect(response.status).toBe(500);
    });
  });
});
