import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.taskId) {
      return new NextResponse("Task ID required", { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
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
    console.error("[TASK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, priority, description, dueDate } = body;

    if (!params.taskId) {
      return new NextResponse("Task ID required", { status: 400 });
    }

    const task = await prisma.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        status,
        priority,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
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
    console.error("[TASK_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.taskId) {
      return new NextResponse("Task ID required", { status: 400 });
    }

    const task = await prisma.task.delete({
      where: {
        id: params.taskId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASK_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}