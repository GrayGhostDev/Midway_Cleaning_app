import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`;
    const key = `documents/${userId}/${uniqueFilename}`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);

    // Generate a signed URL for secure access
    const getCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

    // Save document metadata to database
    const document = await prisma.document.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        key,
        userId,
        url,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
