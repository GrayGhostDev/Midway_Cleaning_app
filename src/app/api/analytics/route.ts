import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAnalytics, generateReport } from '@/lib/analytics';
import { auth } from '@clerk/nextjs';
import { rateLimit } from '@/lib/rate-limit';

// Input validation schema
const analyticsSchema = z.object({
  timeRange: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  format: z.enum(['json', 'pdf', 'excel', 'csv']).optional().default('json'),
});

export async function GET(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const identifier = userId;
    const { success } = await rateLimit.analytics.check(identifier);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { timeRange, startDate, endDate, format } = analyticsSchema.parse(searchParams);

    // Get analytics data
    const data = await getAnalytics(timeRange, startDate, endDate);

    // Return data in requested format
    if (format === 'json') {
      return NextResponse.json({ data });
    }

    // Generate report in requested format
    const report = await generateReport(timeRange, startDate, endDate, format);

    // Set appropriate headers based on format
    const headers = new Headers();
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'pdf':
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename=analytics-${timestamp}.pdf`);
        break;
      case 'excel':
        headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        headers.set('Content-Disposition', `attachment; filename=analytics-${timestamp}.xlsx`);
        break;
      case 'csv':
        headers.set('Content-Type', 'text/csv');
        headers.set('Content-Disposition', `attachment; filename=analytics-${timestamp}.csv`);
        break;
    }

    return new NextResponse(report, { headers });
  } catch (error) {
    console.error('Analytics API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
