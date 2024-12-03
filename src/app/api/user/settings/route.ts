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

    const settings = await prisma.userSettings.findUnique({
      where: { userEmail: session.user.email },
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        theme: 'system',
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        accessibility: {
          highContrast: false,
          reducedMotion: false,
          screenReader: false,
        },
        privacy: {
          shareData: true,
          analytics: true,
          marketing: false,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
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
    const {
      theme,
      language,
      timezone,
      dateFormat,
      currency,
      accessibility,
      privacy,
    } = data;

    const settings = await prisma.userSettings.upsert({
      where: { userEmail: session.user.email },
      update: {
        theme,
        language,
        timezone,
        dateFormat,
        currency,
        accessibility,
        privacy,
        updatedAt: new Date(),
      },
      create: {
        userEmail: session.user.email,
        theme,
        language,
        timezone,
        dateFormat,
        currency,
        accessibility,
        privacy,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
