import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userEmail: session.user.email },
      orderBy: { timestamp: 'desc' },
      take: 50, // Limit to last 50 notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { title, message, type } = data;

    const notification = await prisma.notification.create({
      data: {
        userEmail: session.user.email,
        title,
        message,
        type,
        timestamp: new Date(),
        read: false,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Notification creation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
