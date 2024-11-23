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
    const date = searchParams.get("date");
    const userId = searchParams.get("userId");
    const locationId = searchParams.get("locationId");

    const where: any = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.startTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (userId) {
      where.userId = userId;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    const shifts = await prisma.shift.findMany({
      where,
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
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error("[SHIFTS_GET]", error);
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
    const { userId, locationId, startTime, endTime } = body;

    if (!userId || !locationId || !startTime || !endTime) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const shift = await prisma.shift.create({
      data: {
        userId,
        locationId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
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
    console.error("[SHIFTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}