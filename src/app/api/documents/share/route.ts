import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, email } = await request.json();

    if (!documentId || !email) {
      return NextResponse.json(
        { error: 'Document ID and email are required' },
        { status: 400 }
      );
    }

    // Check if the document exists and belongs to the user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Create a share record
    const share = await prisma.documentShare.create({
      data: {
        documentId,
        sharedByUserId: userId,
        sharedWithEmail: email,
      },
    });

    // Send email notification
    await resend.emails.send({
      from: 'Midway Cleaning <notifications@midwaycleaning.com>',
      to: email,
      subject: 'Document Shared with You',
      html: `
        <h1>A document has been shared with you</h1>
        <p>Hello,</p>
        <p>${userId} has shared a document with you: ${document.name}</p>
        <p>You can access the document by logging into your Midway Cleaning account.</p>
        <p>Best regards,<br>Midway Cleaning Team</p>
      `,
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.json(
      { error: 'Failed to share document' },
      { status: 500 }
    );
  }
}
