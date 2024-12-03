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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        role: true,
        notificationPreferences: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { name, email, phone, company, role, notifications } = data;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
        phone,
        company,
        role,
        notificationPreferences: notifications,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
