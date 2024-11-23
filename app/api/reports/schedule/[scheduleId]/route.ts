import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
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

    const schedule = await prisma.reportSchedule.findUnique({
      where: {
        id: params.scheduleId,
      },
      include: {
        template: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        reports: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[REPORT_SCHEDULE_GET]", error);
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
    const { status, recipients, parameters } = body;

    if (!params.scheduleId) {
      return new NextResponse("Schedule ID required", { status: 400 });
    }

    const schedule = await prisma.reportSchedule.update({
      where: {
        id: params.scheduleId,
      },
      data: {
        status,
        recipients,
        parameters,
        updatedAt: new Date(),
      },
      include: {
        template: true,
        createdBy: {
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
    console.error("[REPORT_SCHEDULE_PATCH]", error);
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

    const schedule = await prisma.reportSchedule.delete({
      where: {
        id: params.scheduleId,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[REPORT_SCHEDULE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}