import { NextRequest } from 'next/server';

export function getRequestIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0] : '127.0.0.1';
}

export function getRequestPath(request: NextRequest): string {
  return new URL(request.url).pathname;
} 