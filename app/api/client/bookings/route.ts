import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {
      clientId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.scheduledDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await prisma.serviceBooking.findMany({
      where,
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
      },
      orderBy: {
        scheduledDate: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[CLIENT_BOOKINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { serviceId, locationId, scheduledDate, scheduledTime, notes } = body;

    if (!serviceId || !locationId || !scheduledDate || !scheduledTime) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const booking = await prisma.serviceBooking.create({
      data: {
        clientId: session.user.id,
        serviceId,
        locationId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        notes,
        status: "PENDING",
      },
      include: {
        service: true,
        location: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[CLIENT_BOOKINGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}