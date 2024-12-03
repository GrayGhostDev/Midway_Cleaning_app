import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('scheduleId');
    const assignedToId = searchParams.get('assignedToId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let whereClause: any = {};
    if (scheduleId) whereClause.scheduleId = scheduleId;
    if (assignedToId) whereClause.assignedToId = assignedToId;
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    const tasks = await prisma.workTask.findMany({
      where: whereClause,
      include: {
        schedule: {
          include: {
            location: true,
          },
        },
        service: true,
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      scheduleId,
      serviceId,
      assignedToId,
      priority,
      notes,
    } = body;

    // Verify schedule exists and is not completed
    const schedule = await prisma.workSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    if (schedule.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot add tasks to completed schedule' },
        { status: 400 }
      );
    }

    // Create the task
    const task = await prisma.workTask.create({
      data: {
        scheduleId,
        serviceId,
        status: 'PENDING',
        assignedToId,
        priority,
        notes,
      },
      include: {
        schedule: {
          include: {
            location: true,
          },
        },
        service: true,
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
