import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ratelimit } from "@/lib/rate-limit";
import { AppError, handleError } from "@/lib/error-handler";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  locationId: z.string().min(1, "Location is required"),
  assigneeId: z.string().min(1, "Assignee is required"),
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

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const tasks = await prisma.task.findMany({
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: true,
        checklist: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("[TASKS_GET]", error);
    return handleError(error);
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

    const session = await getServerSession(authOptions);
    if (!session) {
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
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASKS_POST]", error);
    return handleError(error);
  }
}