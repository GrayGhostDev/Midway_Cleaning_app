import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Email verification is handled by Clerk natively.
// This endpoint is kept for backwards compatibility.

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clerk handles email verification automatically.
    // If you need to trigger a verification email, use Clerk's API:
    // const user = await (await clerkClient()).users.getUser(userId);
    return NextResponse.json({
      message: 'Email verification is managed by Clerk. Check your email for a verification link.',
    });
  } catch (error) {
    console.error('Error with email verification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
