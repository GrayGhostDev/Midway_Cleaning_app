import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");

    const where: any = {};

    if (startDate && endDate) {
      where.scheduledDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (type) {
      where.type = type;
    }

    const maintenanceSchedule = await prisma.maintenanceSchedule.findMany({
      where,
      include: {
        equipment: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        scheduledDate: "asc",
      },
    });

    return NextResponse.json(maintenanceSchedule);
  } catch (error) {
    console.error("[MAINTENANCE_SCHEDULE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { equipmentId, type, scheduledDate, assignedToId, tasks } = body;

    if (!equipmentId || !type || !scheduledDate || !tasks) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const schedule = await prisma.maintenanceSchedule.create({
      data: {
        equipmentId,
        type,
        scheduledDate: new Date(scheduledDate),
        assignedToId,
        tasks,
        status: "SCHEDULED",
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
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[MAINTENANCE_SCHEDULE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}