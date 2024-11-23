import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, priority, description } = body;

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
    console.error("[TASK_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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