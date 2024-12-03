import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@prisma/client';

export async function GET() {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const revenueData = await prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: {
        amount: true,
      },
      where: {
        status: PaymentStatus.PAID,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return months[monthIndex];
    });

    // Group revenue data by month
    const monthlyRevenue = new Map();
    revenueData.forEach(item => {
      const month = new Date(item.createdAt).getMonth();
      const monthName = months[month];
      const currentAmount = monthlyRevenue.get(monthName) || 0;
      monthlyRevenue.set(monthName, currentAmount + (item._sum.amount || 0));
    });

    // Create dataset with 0 for months with no revenue
    const data = {
      labels: lastSixMonths,
      datasets: [
        {
          label: 'Revenue',
          data: lastSixMonths.map(month => monthlyRevenue.get(month) || 0),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
        },
      ],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}
