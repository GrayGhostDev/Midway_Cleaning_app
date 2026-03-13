import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const supabase = createServerClient();

    let query = supabase
      .from('Shift')
      .select('*, user:userId(name, email)')
      .order('startTime', { ascending: true });

    if (employeeId) query = query.eq('userId', employeeId);
    if (status) query = query.eq('status', status);
    if (startDate && endDate) {
      query = query
        .gte('startTime', new Date(startDate).toISOString())
        .lte('startTime', new Date(endDate).toISOString());
    }

    const { data: shifts, error } = await query;
    if (error) throw error;

    return NextResponse.json(shifts ?? []);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { employeeId, startTime, endTime, hourlyRate, notes } = body;

    const supabase = createServerClient();
    const start = new Date(startTime).toISOString();
    const end = new Date(endTime).toISOString();

    // Check for schedule conflicts
    const { data: conflicts, error: conflictError } = await supabase
      .from('Shift')
      .select('id')
      .eq('userId', employeeId)
      .or(
        `and(startTime.lte.${start},endTime.gt.${start}),and(startTime.lt.${end},endTime.gte.${end})`
      );

    if (conflictError) throw conflictError;

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Schedule conflict detected' }, { status: 400 });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

    const { data: shift, error: insertError } = await supabase
      .from('Shift')
      .insert({
        userId: employeeId,
        startTime: start,
        endTime: end,
        duration: durationMinutes,
        status: 'SCHEDULED',
        hourlyRate: hourlyRate || 0,
        notes,
      })
      .select('*, user:userId(name, email)')
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(shift);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
