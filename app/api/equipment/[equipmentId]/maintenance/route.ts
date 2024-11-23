import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { equipmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.equipmentId) {
      return new NextResponse("Equipment ID required", { status: 400 });
    }

    const maintenanceLogs = await prisma.maintenanceLog.findMany({
      where: {
        equipmentId: params.equipmentId,
      },
      orderBy: {
        performedAt: "desc",
      },
    });

    return NextResponse.json(maintenanceLogs);
  } catch (error) {
    console.error("[MAINTENANCE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { equipmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, description, performedBy, cost, notes } = body;

    if (!params.equipmentId || !type || !description || !performedBy || !cost) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        equipmentId: params.equipmentId,
        type,
        description,
        performedBy,
        cost,
        notes,
      },
    });

    // Update equipment's last maintenance date
    await prisma.equipment.update({
      where: {
        id: params.equipmentId,
      },
      data: {
        lastMaintenance: new Date(),
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(maintenanceLog);
  } catch (error) {
    console.error("[MAINTENANCE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}