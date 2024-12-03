import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const notification = await prisma.notification.update({
      where: {
        id: params.id,
        userEmail: session.user.email,
      },
      data: {
        read: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Notification update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.notification.delete({
      where: {
        id: params.id,
        userEmail: session.user.email,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Notification deletion error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
