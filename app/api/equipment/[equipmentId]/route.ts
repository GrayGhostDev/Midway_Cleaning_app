import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    const equipment = await prisma.equipment.findUnique({
      where: {
        id: params.equipmentId,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: true,
        maintenanceLogs: {
          orderBy: {
            performedAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("[EQUIPMENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { equipmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      status,
      assignedUserId,
      locationId,
      lastMaintenance,
      nextMaintenance,
    } = body;

    if (!params.equipmentId) {
      return new NextResponse("Equipment ID required", { status: 400 });
    }

    const equipment = await prisma.equipment.update({
      where: {
        id: params.equipmentId,
      },
      data: {
        status,
        assignedUserId,
        locationId,
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : undefined,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : undefined,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: true,
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("[EQUIPMENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { equipmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.equipmentId) {
      return new NextResponse("Equipment ID required", { status: 400 });
    }

    const equipment = await prisma.equipment.delete({
      where: {
        id: params.equipmentId,
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("[EQUIPMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}