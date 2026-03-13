import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const defaultSettings = {
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
};

// Settings are stored in Clerk user metadata.
// This API provides a stable interface for the frontend.

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const settings = (sessionClaims?.metadata as Record<string, unknown>)?.settings || defaultSettings;
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();

    // In a full implementation, update Clerk user metadata:
    // await (await clerkClient()).users.updateUserMetadata(userId, { publicMetadata: { settings: data } });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Settings update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
