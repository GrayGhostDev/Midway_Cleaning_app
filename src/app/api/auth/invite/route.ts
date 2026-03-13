import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { type Role, hasRole } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = ((sessionClaims?.metadata as { role?: Role })?.role || 'CLIENT') as Role;

    const body = await request.json();
    const { email, role, name } = body;

    if (!hasRole(userRole, role as Role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to assign this role' },
        { status: 403 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${appUrl}/sign-up?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Invitation to Midway Cleaning',
      template: 'invitation',
      variables: {
        name,
        inviteUrl,
        expiresAt: expiresAt.toLocaleDateString(),
      },
    });

    return NextResponse.json({
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
