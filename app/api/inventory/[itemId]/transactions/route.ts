import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

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

    const transactions = await prisma.inventoryTransaction.findMany({
      where: {
        itemId: params.itemId,
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
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[INVENTORY_TRANSACTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, quantity, notes } = body;

    if (!params.itemId || !type || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: {
        id: params.itemId,
      },
    });

    if (!item) {
      return new NextResponse("Item not found", { status: 404 });
    }

    // Start a transaction to ensure data consistency
    const [transaction, updatedItem] = await prisma.$transaction([
      prisma.inventoryTransaction.create({
        data: {
          itemId: params.itemId,
          type,
          quantity,
          notes,
          userId: session.user.id,
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
      }),
      prisma.inventoryItem.update({
        where: {
          id: params.itemId,
        },
        data: {
          quantity: type === "IN" ? item.quantity + quantity : item.quantity - quantity,
          status: {
            set: item.quantity <= item.minQuantity ? "LOW_STOCK" : "IN_STOCK",
          },
        },
      }),
    ]);

    return NextResponse.json({ transaction, updatedItem });
  } catch (error) {
    console.error("[INVENTORY_TRANSACTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}