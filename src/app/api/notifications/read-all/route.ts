import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        userEmail: session.user.email,
        read: false,
      },
      data: {
        read: true,
        updatedAt: new Date(),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
