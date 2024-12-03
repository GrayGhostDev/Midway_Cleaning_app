import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compose } from '@/lib/api/middleware';
import { validateRequest, rateLimiter, requestLogger, apiVersion, cors } from '@/lib/api/middleware';
import { ApiError } from '@/lib/api/errors';
import { Repository } from '@/lib/db/repository';
import { taskSchema } from '@/lib/db/validation';
import { prisma } from '@/lib/db/client';

const taskRepository = new Repository(prisma.task, taskSchema, ['assignee', 'location']);

// Query parameters validation schema
const querySchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Request body validation schema
const createTaskSchema = taskSchema.omit({ id: true, createdAt: true, updatedAt: true });

export async function GET(req: NextRequest) {
  return compose(
    rateLimiter,
    requestLogger,
    apiVersion('1.0.0'),
    cors
  )(req, async () => {
    try {
      const { searchParams } = new URL(req.url);
      const query = querySchema.parse({
        status: searchParams.get('status'),
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
      });

      const skip = (query.page - 1) * query.limit;
      const where = query.status ? { status: query.status } : {};

      const [tasks, total] = await Promise.all([
        taskRepository.findMany({
          where,
          skip,
          take: query.limit,
          orderBy: { createdAt: 'desc' },
        }),
        taskRepository.count(where),
      ]);

      return NextResponse.json({
        data: tasks,
        pagination: {
          total,
          pages: Math.ceil(total / query.limit),
          page: query.page,
          limit: query.limit,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ApiError.BadRequest('Invalid query parameters', error.errors);
      }
      throw error;
    }
  });
}

export async function POST(req: NextRequest) {
  return compose(
    rateLimiter,
    validateRequest(createTaskSchema),
    requestLogger,
    apiVersion('1.0.0'),
    cors
  )(req, async () => {
    const data = await req.json();
    const task = await taskRepository.create(data);
    return NextResponse.json(task, { status: 201 });
  });
}

export async function OPTIONS() {
  return cors(new NextRequest('http://localhost'));
}
