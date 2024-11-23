import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.itemId) {
      return new NextResponse("Item ID required", { status: 400 });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: {
        id: params.itemId,
      },
      include: {
        location: true,
        supplier: true,
        transactions: {
          orderBy: {
            date: "desc",
          },
          take: 10,
        },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[INVENTORY_ITEM_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { quantity, minQuantity, locationId, supplierId } = body;

    if (!params.itemId) {
      return new NextResponse("Item ID required", { status: 400 });
    }

    const item = await prisma.inventoryItem.update({
      where: {
        id: params.itemId,
      },
      data: {
        quantity,
        minQuantity,
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
    console.error("[INVENTORY_ITEM_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.itemId) {
      return new NextResponse("Item ID required", { status: 400 });
    }

    const item = await prisma.inventoryItem.delete({
      where: {
        id: params.itemId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[INVENTORY_ITEM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}