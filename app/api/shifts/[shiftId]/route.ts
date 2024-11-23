import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { shiftId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.shiftId) {
      return new NextResponse("Shift ID required", { status: 400 });
    }

    const shift = await prisma.shift.findUnique({
      where: {
        id: params.shiftId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: true,
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error("[SHIFT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { shiftId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, startTime, endTime, userId, locationId } = body;

    if (!params.shiftId) {
      return new NextResponse("Shift ID required", { status: 400 });
    }

    const shift = await prisma.shift.update({
      where: {
        id: params.shiftId,
      },
      data: {
        status,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        userId,
        locationId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: true,
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error("[SHIFT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { shiftId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.shiftId) {
      return new NextResponse("Shift ID required", { status: 400 });
    }

    const shift = await prisma.shift.delete({
      where: {
        id: params.shiftId,
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error("[SHIFT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}