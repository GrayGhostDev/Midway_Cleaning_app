import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cleanerId = searchParams.get('cleanerId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const bookingId = searchParams.get('bookingId');

    const where: Record<string, unknown> = {};
    if (cleanerId) where.cleanerId = cleanerId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (bookingId) where.bookingId = bookingId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        cleaner: { select: { name: true, email: true } },
        booking: {
          include: {
            service: true,
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
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
    const { title, description, cleanerId, bookingId, priority, dueDate } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: 'PENDING',
        priority: priority || 'MEDIUM',
        cleanerId,
        bookingId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: {
        cleaner: { select: { name: true, email: true } },
        booking: { include: { service: true } },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
