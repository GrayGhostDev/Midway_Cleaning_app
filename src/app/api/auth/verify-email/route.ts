import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate verification token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

    // Save verification token
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send verification email
    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      variables: {
        name: user.name || 'User',
        verifyUrl,
        expiresAt: expiresAt.toLocaleDateString(),
      },
    });

    return NextResponse.json({
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await request.json();

    // Find valid verification token
    const verification = await prisma.emailVerification.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        used: false,
      },
      include: {
        user: true,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verification.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { used: true },
      }),
    ]);

    // Send confirmation email
    await sendEmail({
      to: verification.user.email,
      subject: 'Email Verified Successfully',
      template: 'email-verified',
      variables: {
        name: verification.user.name || 'User',
      },
    });

    return NextResponse.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
