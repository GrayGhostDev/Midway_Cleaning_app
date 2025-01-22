import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkRole } from '@/middleware/auth';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  dueDate: z.string().datetime().optional(),
  cleanerId: z.string().optional(),
  bookingId: z.string().optional()
});

type TaskWithRelations = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  cleaner: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  booking: {
    id: string;
    date: Date;
    status: string;
    service: {
      name: string;
    };
  } | null;
};

const querySchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  sortBy: z.enum(['dueDate', 'priority', 'status', 'title']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

export async function GET(req: Request) {
  const authCheck = await checkRole(['ADMIN', 'MANAGER', 'CLEANER']);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const url = new URL(req.url);
    const validatedQuery = querySchema.parse(Object.fromEntries(url.searchParams));
    
    // Build where clause
    const where: any = authCheck.role === 'CLEANER' ? {
      cleanerId: (await prisma.user.findUnique({ where: { clerkId: (await auth()).userId! } }))?.id
    } : {};

    // Add status filter
    if (validatedQuery.status) {
      where.status = validatedQuery.status;
    }

    // Add priority filter
    if (validatedQuery.priority) {
      where.priority = validatedQuery.priority;
    }

    // Add date range filter
    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.dueDate = {
        ...(validatedQuery.startDate && { gte: new Date(validatedQuery.startDate) }),
        ...(validatedQuery.endDate && { lte: new Date(validatedQuery.endDate) })
      };
    }

    // Calculate pagination
    const page = validatedQuery.page || 1;
    const limit = validatedQuery.limit || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalTasks = await prisma.task.count({ where });
    const totalPages = Math.ceil(totalTasks / limit);

    // Build sort object
    const orderBy = validatedQuery.sortBy 
      ? { [validatedQuery.sortBy]: validatedQuery.order || 'desc' }
      : { dueDate: 'desc' };

    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        booking: {
          select: {
            id: true,
            date: true,
            status: true,
            service: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      tasks: tasks.map((task: TaskWithRelations) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.cleaner ? {
          id: task.cleaner.id,
          name: task.cleaner.name || task.cleaner.email,
        } : null,
        booking: task.booking ? {
          id: task.booking.id,
          date: task.booking.date,
          status: task.booking.status,
          serviceName: task.booking.service.name
        } : null
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalTasks,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authCheck = await checkRole(['ADMIN', 'MANAGER']);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const data = await req.json();
    const validatedData = taskSchema.parse(data);

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        cleanerId: validatedData.cleanerId,
        bookingId: validatedData.bookingId
      },
      include: {
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        booking: {
          select: {
            id: true,
            date: true,
            status: true,
            service: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.cleaner ? {
        id: task.cleaner.id,
        name: task.cleaner.name || task.cleaner.email,
      } : null,
      booking: task.booking ? {
        id: task.booking.id,
        date: task.booking.date,
        status: task.booking.status,
        serviceName: task.booking.service.name
      } : null
    });

  } catch (error) {
    console.error('Failed to create task:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid task data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const authCheck = await checkRole(['ADMIN', 'MANAGER', 'CLEANER']);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Cleaners can only update status
    if (authCheck.role === 'CLEANER') {
      if (Object.keys(updateData).some(key => key !== 'status')) {
        return NextResponse.json({ error: 'Insufficient permissions to update these fields' }, { status: 403 });
      }

      const task = await prisma.task.findUnique({
        where: { id },
        select: { cleanerId: true }
      });

      const cleanerId = (await prisma.user.findUnique({ 
        where: { clerkId: (await auth()).userId! }
      }))?.id;

      if (task?.cleanerId !== cleanerId) {
        return NextResponse.json({ error: 'Can only update tasks assigned to you' }, { status: 403 });
      }
    }

    const validatedData = taskSchema.partial().parse(updateData);

    const task = await prisma.task.update({
      where: { id },
      data: validatedData,
      include: {
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        booking: {
          select: {
            id: true,
            date: true,
            status: true,
            service: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.cleaner ? {
        id: task.cleaner.id,
        name: task.cleaner.name || task.cleaner.email,
      } : null,
      booking: task.booking ? {
        id: task.booking.id,
        date: task.booking.date,
        status: task.booking.status,
        serviceName: task.booking.service.name
      } : null
    });

  } catch (error) {
    console.error('Failed to update task:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid task data', details: error.errors }, { status: 400 });
    }
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authCheck = await checkRole(['ADMIN', 'MANAGER']);
  if (!authCheck.success) {
    return authCheck.response;
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Task deleted successfully' });

  } catch (error) {
    console.error('Failed to delete task:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
