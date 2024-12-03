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
    const employeeId = searchParams.get('employeeId');
    const locationId = searchParams.get('locationId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let whereClause: any = {};
    if (employeeId) whereClause.employeeId = employeeId;
    if (locationId) whereClause.locationId = locationId;
    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const schedules = await prisma.workSchedule.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            name: true,
            email: true,
          },
        },
        location: true,
        workTasks: {
          include: {
            service: true,
            assignedTo: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
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
      employeeId,
      locationId,
      startTime,
      endTime,
      tasks,
      notes,
    } = body;

    // Check for schedule conflicts
    const conflicts = await prisma.workSchedule.findMany({
      where: {
        employeeId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Schedule conflict detected' },
        { status: 400 }
      );
    }

    // Create schedule with tasks
    const schedule = await prisma.workSchedule.create({
      data: {
        employeeId,
        locationId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'SCHEDULED',
        notes,
        workTasks: {
          create: tasks.map((task: any) => ({
            serviceId: task.serviceId,
            status: 'PENDING',
            assignedToId: task.assignedToId,
            priority: task.priority,
            notes: task.notes,
          })),
        },
      },
      include: {
        employee: {
          select: {
            name: true,
            email: true,
          },
        },
        location: true,
        workTasks: {
          include: {
            service: true,
            assignedTo: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
