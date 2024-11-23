import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");

    if (!serviceId || !date) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    // Get all bookings for the specified date
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        serviceId,
        scheduledDate: new Date(date),
        status: {
          in: ["CONFIRMED", "IN_PROGRESS"],
        },
      },
      select: {
        scheduledTime: true,
      },
    });

    // Get all available staff for the service
    const availableStaff = await prisma.user.count({
      where: {
        role: "EMPLOYEE",
        // Add additional criteria for staff availability
      },
    });

    // Generate time slots (example: 9 AM to 5 PM, hourly)
    const timeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      const bookedCount = bookings.filter(b => b.scheduledTime === time).length;
      
      timeSlots.push({
        time,
        available: bookedCount < availableStaff,
        reason: bookedCount >= availableStaff ? "Fully booked" : null,
      });
    }

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("[CLIENT_SERVICE_AVAILABILITY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}