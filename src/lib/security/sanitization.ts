import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError } from '@/lib/api/errors';

// Sanitize HTML content -- strips all tags for safety (jsdom/dompurify not installed)
export function sanitizeHtml(dirty: string): string {
  return dirty.replace(/<[^>]*>/g, '');
}

// Sanitize plain text (remove HTML and scripts)
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

// Sanitize URL
export function sanitizeUrl(url: string): string {
  const urlSchema = z.string().url().safeParse(url);
  if (!urlSchema.success) {
    throw new ApiError(400, 'Invalid URL');
  }
  return url;
}

// Sanitize email
export function sanitizeEmail(email: string): string {
  const emailSchema = z.string().email().safeParse(email);
  if (!emailSchema.success) {
    throw new ApiError(400, 'Invalid email');
  }
  return email.toLowerCase();
}

// Sanitize phone number
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

// Sanitize file name
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
}

// Sanitize query parameters
export function sanitizeQueryParams(params: URLSearchParams): URLSearchParams {
  const sanitized = new URLSearchParams();

  params.forEach((value, key) => {
    sanitized.append(key, sanitizeText(value));
  });

  return sanitized;
}

// Request body sanitization middleware
export async function sanitizeRequestBody(req: NextRequest): Promise<unknown> {
  try {
    const body = await req.json();
    return sanitizeObject(body);
  } catch {
    throw new ApiError(400, 'Invalid request body');
  }
}

// Recursively sanitize object values
export function sanitizeObject(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeText(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('html')) {
        sanitized[key] = sanitizeHtml(value);
      } else if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('url')) {
        sanitized[key] = sanitizeUrl(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else {
      sanitized[key] = sanitizeObject(value);
    }
  }

  return sanitized;
}

// SQL injection prevention for raw queries
export function escapeSqlIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

// Validate and sanitize file upload
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): void {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'] } = options;

  if (file.size > maxSize) {
    throw new ApiError(400, 'File size exceeds limit');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new ApiError(400, 'File type not allowed');
  }

  const fileName = sanitizeFileName(file.name);
  if (fileName !== file.name) {
    throw new ApiError(400, 'Invalid file name');
  }
}
