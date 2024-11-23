import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.scheduleId) {
      return new NextResponse("Schedule ID required", { status: 400 });
    }

    const schedule = await prisma.maintenanceSchedule.findUnique({
      where: {
        id: params.scheduleId,
      },
      include: {
        equipment: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        completedTasks: true,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[MAINTENANCE_SCHEDULE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, completedTasks, notes } = body;

    if (!params.scheduleId) {
      return new NextResponse("Schedule ID required", { status: 400 });
    }

    const schedule = await prisma.maintenanceSchedule.update({
      where: {
        id: params.scheduleId,
      },
      data: {
        status,
        completedTasks: {
          create: completedTasks,
        },
        notes,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
      include: {
        equipment: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        completedTasks: true,
      },
    });

    // Update equipment status if maintenance is completed
    if (status === "COMPLETED") {
      await prisma.equipment.update({
        where: {
          id: schedule.equipmentId,
        },
        data: {
          lastMaintenanceDate: new Date(),
          status: "AVAILABLE",
        },
      });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[MAINTENANCE_SCHEDULE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.scheduleId) {
      return new NextResponse("Schedule ID required", { status: 400 });
    }

    const schedule = await prisma.maintenanceSchedule.delete({
      where: {
        id: params.scheduleId,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[MAINTENANCE_SCHEDULE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}