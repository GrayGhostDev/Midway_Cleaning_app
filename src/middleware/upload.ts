import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface UploadConfig {
  maxFileSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
  destination?: string;
  generateFilename?: (originalname: string) => string;
}

const defaultConfig: UploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxFiles: 5,
  destination: './uploads',
  generateFilename: (originalname: string) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalname.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
  },
};

export function upload(config: UploadConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config };

  return async (req: NextRequest) => {
    try {
      if (req.method !== 'POST') {
        return NextResponse.next();
      }

      const contentType = req.headers.get('content-type');
      if (!contentType?.includes('multipart/form-data')) {
        return NextResponse.next();
      }

      const formData = await req.formData();
      const files = Array.from(formData.values()).filter(
        (value): value is File => value instanceof File
      );

      // Check number of files
      if (files.length > mergedConfig.maxFiles!) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too Many Files',
            message: `Maximum ${mergedConfig.maxFiles} files allowed`,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Validate each file
      for (const file of files) {
        // Check file size
        if (file.size > mergedConfig.maxFileSize!) {
          return new NextResponse(
            JSON.stringify({
              error: 'File Too Large',
              message: `File ${file.name} exceeds maximum size of ${
                mergedConfig.maxFileSize! / (1024 * 1024)
              }MB`,
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Check file type
        if (!mergedConfig.allowedTypes!.includes(file.type)) {
          return new NextResponse(
            JSON.stringify({
              error: 'Invalid File Type',
              message: `File type ${file.type} not allowed`,
              allowedTypes: mergedConfig.allowedTypes,
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Scan file content (basic implementation - enhance with virus scanning in production)
        const buffer = await file.arrayBuffer();
        if (await hasExecutableContent(buffer)) {
          return new NextResponse(
            JSON.stringify({
              error: 'Security Risk',
              message: 'File contains potentially malicious content',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

      // Add validated files to the request for further processing
      const validatedFiles = files.map((file) => ({
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
        buffer: file,
        filename: mergedConfig.generateFilename!(file.name),
      }));

      // Attach validated files to the request for downstream middleware/handlers
      (req as any).validatedFiles = validatedFiles;

      return NextResponse.next();
    } catch (error) {
      console.error('File upload error:', error);
      return new NextResponse(
        JSON.stringify({
          error: 'Upload Error',
          message: 'An error occurred while processing the upload',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

// Basic executable content detection (enhance this in production)
async function hasExecutableContent(buffer: ArrayBuffer): Promise<boolean> {
  const view = new Uint8Array(buffer);
  const signatures = {
    // Common executable signatures
    MZ: [0x4d, 0x5a], // Windows executable
    ELF: [0x7f, 0x45, 0x4c, 0x46], // Linux executable
    MACHO: [0xfe, 0xed, 0xfa, 0xce], // macOS executable
  };

  // Check for executable signatures
  for (const sig of Object.values(signatures)) {
    if (sig.every((byte, i) => view[i] === byte)) {
      return true;
    }
  }

  return false;
}

// Specialized upload configurations
export const imageUpload = upload({
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 10,
  destination: './uploads/images',
});

export const documentUpload = upload({
  maxFileSize: 20 * 1024 * 1024, // 20MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxFiles: 3,
  destination: './uploads/documents',
});

export const avatarUpload = upload({
  maxFileSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 1,
  destination: './uploads/avatars',
  generateFilename: (originalname: string) => {
    const extension = originalname.split('.').pop();
    return `avatar-${Date.now()}.${extension}`;
  },
});
