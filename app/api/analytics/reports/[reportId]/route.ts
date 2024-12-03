import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { reportId: string } }
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

    if (!params.reportId) {
      return new NextResponse("Report ID required", { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: {
        id: params.reportId,
      },
      include: {
        user: {
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
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.reportId) {
      return new NextResponse("Report ID required", { status: 400 });
    }

    await prisma.report.delete({
      where: {
        id: params.reportId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[REPORT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}