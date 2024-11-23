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
    const { templateId, schedule } = body;

    if (!templateId || !schedule) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const template = await prisma.reportTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return new NextResponse("Template not found", { status: 404 });
    }

    const automation = await prisma.reportAutomation.create({
      data: {
        templateId,
        schedule,
        status: "ACTIVE",
        createdById: session.user.id,
        nextRunAt: calculateNextRun(schedule),
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

    return NextResponse.json(automation);
  } catch (error) {
    console.error("[REPORT_AUTOMATION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const automations = await prisma.reportAutomation.findMany({
      include: {
        template: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        lastRun: {
          select: {
            id: true,
            createdAt: true,
            status: true,
          },
        },
      },
      orderBy: {
        nextRunAt: "asc",
      },
    });

    return NextResponse.json(automations);
  } catch (error) {
    console.error("[REPORT_AUTOMATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function calculateNextRun(schedule: any): Date {
  const now = new Date();
  
  switch (schedule.frequency) {
    case "DAILY":
      return addDays(now, 1);
    case "WEEKLY":
      return addWeeks(now, 1);
    case "MONTHLY":
      return addMonths(now, 1);
    case "QUARTERLY":
      return addMonths(now, 3);
    default:
      return now;
  }
}