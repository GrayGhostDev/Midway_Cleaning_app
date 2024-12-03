import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ServiceStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (!userRole || userRole !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {
      userId: userId,
    };

    if (status) {
      where.status = status as ServiceStatus;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        payment: true,
        review: true,
        feedback: true,
      },
      orderBy: {
        date: "desc",
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
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (!userRole || userRole !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { serviceId, date, notes } = body;

    if (!serviceId || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date: new Date(date),
        notes,
        status: ServiceStatus.PENDING,
      },
      include: {
        service: true,
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        payment: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[CLIENT_BOOKINGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}