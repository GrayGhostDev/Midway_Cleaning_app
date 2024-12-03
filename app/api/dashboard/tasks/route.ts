import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: limit,
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            {
              cleaner: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        },
        include: {
          booking: {
            include: {
              service: true,
            },
          },
          cleaner: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.task.count({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            {
              cleaner: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        },
      }),
    ]);

    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      service: task.booking?.service?.name,
      cleaner: task.cleaner?.name || 'Unassigned',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    }));

    return NextResponse.json({
      tasks: formattedTasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
