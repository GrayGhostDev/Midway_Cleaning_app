import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { authOptions } from '@/lib/auth';
import { UserRole, canAccessRole } from '@/lib/auth/roles';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role, name } = body;

    // Validate role access
    if (!canAccessRole(session.user.role as UserRole, role as UserRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to assign this role' },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiration

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        name,
        role,
        token,
        expiresAt,
      },
    });

    // Send invitation email
    const inviteUrl = `${process.env.NEXTAUTH_URL}/auth/register?token=${token}`;
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
      invitationId: invitation.id,
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
