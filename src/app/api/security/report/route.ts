import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { generateSecurityReport } from '@/lib/security-reports';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const report = await generateSecurityReport();
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating security report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
