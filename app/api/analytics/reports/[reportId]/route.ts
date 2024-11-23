import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.reportId) {
      return new NextResponse("Report ID required", { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: {
        id: params.reportId,
      },
      include: {
        generatedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.reportId) {
      return new NextResponse("Report ID required", { status: 400 });
    }

    const report = await prisma.report.delete({
      where: {
        id: params.reportId,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}