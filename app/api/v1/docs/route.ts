import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/api/swagger';

export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}
