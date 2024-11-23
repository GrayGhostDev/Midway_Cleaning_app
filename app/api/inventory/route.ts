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
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const locationId = searchParams.get("locationId");

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    const inventory = await prisma.inventoryItem.findMany({
      where,
      include: {
        location: true,
        supplier: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("[INVENTORY_GET]", error);
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
    const { name, category, quantity, minQuantity, unit, locationId, supplierId } = body;

    if (!name || !category || !quantity || !minQuantity || !unit || !locationId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        quantity,
        minQuantity,
        unit,
        locationId,
        supplierId,
        status: quantity <= minQuantity ? "LOW_STOCK" : "IN_STOCK",
      },
      include: {
        location: true,
        supplier: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[INVENTORY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}