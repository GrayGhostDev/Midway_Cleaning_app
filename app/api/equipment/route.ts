import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const locationId = searchParams.get("locationId");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    const equipment = await prisma.equipment.findMany({
      where,
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
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("[EQUIPMENT_GET]", error);
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
    const {
      name,
      serialNumber,
      type,
      purchaseDate,
      warrantyExpiry,
      locationId,
    } = body;

    if (!name || !serialNumber || !type || !purchaseDate || !locationId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const equipment = await prisma.equipment.create({
      data: {
        name,
        serialNumber,
        type,
        purchaseDate: new Date(purchaseDate),
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
        locationId,
      },
      include: {
        location: true,
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("[EQUIPMENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}