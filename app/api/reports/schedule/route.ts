import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { addDays, addWeeks, addMonths } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { templateId, frequency, startDate, recipients, parameters } = body;

    if (!templateId || !frequency || !startDate || !recipients) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Calculate next run date based on frequency
    const nextRunDate = calculateNextRunDate(new Date(startDate), frequency);

    const schedule = await prisma.reportSchedule.create({
      data: {
        templateId,
        frequency,
        startDate: new Date(startDate),
        nextRunDate,
        recipients,
        parameters: parameters || {},
        status: "ACTIVE",
        createdById: session.user.id,
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
    console.error("[REPORT_SCHEDULE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schedules = await prisma.reportSchedule.findMany({
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
      orderBy: {
        nextRunDate: "asc",
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("[REPORT_SCHEDULE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function calculateNextRunDate(startDate: Date, frequency: string): Date {
  switch (frequency) {
    case "DAILY":
      return addDays(startDate, 1);
    case "WEEKLY":
      return addWeeks(startDate, 1);
    case "MONTHLY":
      return addMonths(startDate, 1);
    case "QUARTERLY":
      return addMonths(startDate, 3);
    default:
      return startDate;
  }
}