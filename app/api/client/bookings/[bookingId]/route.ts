import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bookingId) {
      return new NextResponse("Booking ID required", { status: 400 });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: {
        id: params.bookingId,
        clientId: session.user.id,
      },
      include: {
        service: true,
        location: true,
        assignedStaff: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        feedback: true,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[CLIENT_BOOKING_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bookingId) {
      return new NextResponse("Booking ID required", { status: 400 });
    }

    const body = await req.json();
    const { scheduledDate, scheduledTime, notes } = body;

    const booking = await prisma.serviceBooking.findUnique({
      where: {
        id: params.bookingId,
        clientId: session.user.id,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.status !== "PENDING") {
      return new NextResponse("Cannot modify confirmed booking", { status: 400 });
    }

    const updatedBooking = await prisma.serviceBooking.update({
      where: {
        id: params.bookingId,
      },
      data: {
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        scheduledTime,
        notes,
      },
      include: {
        service: true,
        location: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("[CLIENT_BOOKING_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bookingId) {
      return new NextResponse("Booking ID required", { status: 400 });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: {
        id: params.bookingId,
        clientId: session.user.id,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.status !== "PENDING") {
      return new NextResponse("Cannot cancel confirmed booking", { status: 400 });
    }

    await prisma.serviceBooking.delete({
      where: {
        id: params.bookingId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CLIENT_BOOKING_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}