import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { automationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.automationId) {
      return new NextResponse("Automation ID required", { status: 400 });
    }

    const automation = await prisma.reportAutomation.findUnique({
      where: {
        id: params.automationId,
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
        lastRun: {
          select: {
            id: true,
            createdAt: true,
            status: true,
          },
        },
        runs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    return NextResponse.json(automation);
  } catch (error) {
    console.error("[REPORT_AUTOMATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { automationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, schedule } = body;

    if (!params.automationId) {
      return new NextResponse("Automation ID required", { status: 400 });
    }

    const automation = await prisma.reportAutomation.update({
      where: {
        id: params.automationId,
      },
      data: {
        status,
        schedule,
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

    return NextResponse.json(automation);
  } catch (error) {
    console.error("[REPORT_AUTOMATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { automationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.automationId) {
      return new NextResponse("Automation ID required", { status: 400 });
    }

    const automation = await prisma.reportAutomation.delete({
      where: {
        id: params.automationId,
      },
    });

    return NextResponse.json(automation);
  } catch (error) {
    console.error("[REPORT_AUTOMATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}