import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ServiceStatus, UserRole } from "@prisma/client";

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
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");

    if (!serviceId || !date) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    // Get all bookings for the specified date
    const bookings = await prisma.booking.findMany({
      where: {
        serviceId,
        date: new Date(date),
        status: {
          in: [ServiceStatus.PENDING, ServiceStatus.IN_PROGRESS],
        },
      },
    });

    // Get all available cleaners
    const availableCleaners = await prisma.user.count({
      where: {
        role: UserRole.CLEANER,
        isActive: true,
      },
    });

    // Generate time slots (example: 9 AM to 5 PM, hourly)
    const timeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      const bookedCount = bookings.length;
      
      timeSlots.push({
        time,
        available: bookedCount < availableCleaners,
        reason: bookedCount >= availableCleaners ? "No cleaners available" : null,
      });
    }

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("[CLIENT_SERVICE_AVAILABILITY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}