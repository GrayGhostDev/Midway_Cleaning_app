import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await prisma.workSchedule.findUnique({
      where: { id: params.id },
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

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, startTime, endTime } = body;

    // If changing times, check for conflicts
    if (startTime || endTime) {
      const currentSchedule = await prisma.workSchedule.findUnique({
        where: { id: params.id },
      });

      if (!currentSchedule) {
        return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
      }

      const conflicts = await prisma.workSchedule.findMany({
        where: {
          employeeId: currentSchedule.employeeId,
          id: { not: params.id },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime ? new Date(startTime) : currentSchedule.startTime } },
                { endTime: { gt: startTime ? new Date(startTime) : currentSchedule.startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime ? new Date(endTime) : currentSchedule.endTime } },
                { endTime: { gte: endTime ? new Date(endTime) : currentSchedule.endTime } },
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
    }

    const schedule = await prisma.workSchedule.update({
      where: { id: params.id },
      data: {
        status,
        notes,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
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
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if schedule exists and can be deleted
    const schedule = await prisma.workSchedule.findUnique({
      where: { id: params.id },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    if (schedule.status === 'IN_PROGRESS' || schedule.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot delete schedule that is in progress or completed' },
        { status: 400 }
      );
    }

    // Delete schedule and related tasks
    await prisma.$transaction([
      prisma.workTask.deleteMany({
        where: { scheduleId: params.id },
      }),
      prisma.workSchedule.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
