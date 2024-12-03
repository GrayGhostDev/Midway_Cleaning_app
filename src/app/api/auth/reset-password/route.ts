import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({
        message: 'If an account exists, a password reset email has been sent',
      });
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    // Save reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      variables: {
        name: user.name || 'User',
        resetUrl,
        expiresAt: expiresAt.toLocaleTimeString(),
      },
    });

    return NextResponse.json({
      message: 'If an account exists, a password reset email has been sent',
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Find valid reset token
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        used: false,
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    // Send confirmation email
    await sendEmail({
      to: resetToken.user.email,
      subject: 'Password Changed Successfully',
      template: 'password-changed',
      variables: {
        name: resetToken.user.name || 'User',
      },
    });

    return NextResponse.json({
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
