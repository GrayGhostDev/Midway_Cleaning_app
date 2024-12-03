import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentStatus, ServiceStatus, UserRole } from '@prisma/client';

export async function GET() {
  try {
    const [
      totalRevenue,
      pendingBookings,
      pendingTasks,
      activeCleaners,
    ] = await Promise.all([
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: PaymentStatus.PAID,
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
          },
        },
      }),
      prisma.booking.count({
        where: { status: ServiceStatus.PENDING },
      }),
      prisma.task.count({
        where: { status: 'PENDING' },
      }),
      prisma.user.count({
        where: {
          role: UserRole.CLEANER,
          isActive: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingBookings,
      pendingTasks,
      activeCleaners,
      trends: {
        revenue: 12, // Calculate actual trend
        tasks: -8,
        cleaners: 4,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
