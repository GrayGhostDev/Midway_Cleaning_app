import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ratelimit } from "@/lib/rate-limit";
import { AppError, handleError } from "@/lib/error-handler";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  cleanerId: z.string().min(1, "Cleaner is required"),
  bookingId: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)),
});

export async function GET() {
  try {
    // Rate limiting
    const ip = "127.0.0.1"; // In production, get from request headers
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      throw new AppError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    }

    const { userId } = auth();
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const tasks = await prisma.task.findMany({
      include: {
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        booking: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("[TASKS_GET]", error);
    if (error instanceof AppError) {
      return handleError(error);
    }
    return handleError(new AppError("Failed to fetch tasks", 500, "FETCH_TASKS_ERROR"));
  }
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = "127.0.0.1"; // In production, get from request headers
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      throw new AppError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    }

    const { userId } = auth();
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    
    // Validate request body
    const validatedData = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        status: "PENDING",
      },
      include: {
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        booking: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASKS_POST]", error);
    return handleError(error);
  }
}