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

    const task = await prisma.workTask.findUnique({
      where: { id: params.id },
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

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
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
    const { status, assignedToId, priority, notes } = body;

    // Verify task exists and can be updated
    const currentTask = await prisma.workTask.findUnique({
      where: { id: params.id },
      include: {
        schedule: true,
      },
    });

    if (!currentTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (currentTask.schedule.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot update task in completed schedule' },
        { status: 400 }
      );
    }

    // Handle task completion
    const updateData: any = {
      status,
      assignedToId,
      priority,
      notes,
    };

    if (status === 'COMPLETED' && currentTask.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status !== 'COMPLETED' && currentTask.status === 'COMPLETED') {
      updateData.completedAt = null;
    }

    const task = await prisma.$transaction(async (prisma) => {
      const updatedTask = await prisma.workTask.update({
        where: { id: params.id },
        data: updateData,
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

      // Check if all tasks in schedule are completed
      const incompleteTasks = await prisma.workTask.count({
        where: {
          scheduleId: currentTask.scheduleId,
          status: { not: 'COMPLETED' },
        },
      });

      if (incompleteTasks === 0) {
        await prisma.workSchedule.update({
          where: { id: currentTask.scheduleId },
          data: { status: 'COMPLETED' },
        });
      }

      return updatedTask;
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
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

    // Verify task exists and can be deleted
    const task = await prisma.workTask.findUnique({
      where: { id: params.id },
      include: {
        schedule: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.schedule.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot delete task from completed schedule' },
        { status: 400 }
      );
    }

    if (task.status === 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Cannot delete task that is in progress' },
        { status: 400 }
      );
    }

    await prisma.workTask.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
