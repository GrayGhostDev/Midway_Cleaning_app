import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { ServiceStatus } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bookingId) {
      return new NextResponse("Booking ID required", { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: params.bookingId,
        userId: userId,
      },
      include: {
        service: true,
        cleaner: {
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
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { date, notes } = body;

    if (!params.bookingId) {
      return new NextResponse("Booking ID required", { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: params.bookingId,
        userId: userId,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.status !== ServiceStatus.PENDING) {
      return new NextResponse("Cannot modify confirmed booking", { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: params.bookingId,
      },
      data: {
        date: date ? new Date(date) : undefined,
        notes,
      },
      include: {
        service: true,
        cleaner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
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
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bookingId) {
      return new NextResponse("Booking ID required", { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: params.bookingId,
        userId: userId,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.status !== ServiceStatus.PENDING) {
      return new NextResponse("Cannot cancel confirmed booking", { status: 400 });
    }

    await prisma.booking.update({
      where: {
        id: params.bookingId,
      },
      data: {
        status: ServiceStatus.CANCELLED,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CLIENT_BOOKING_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}