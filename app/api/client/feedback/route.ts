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

    const feedback = await prisma.feedback.findMany({
      where: {
        userId: userId,
      },
      include: {
        booking: {
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("[CLIENT_FEEDBACK_GET]", error);
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
    const { bookingId, rating, comment } = body;

    if (!bookingId || !rating || !comment) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        userId: userId,
        status: ServiceStatus.COMPLETED,
      },
    });

    if (!booking) {
      return new NextResponse("Invalid booking", { status: 400 });
    }

    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        bookingId,
      },
    });

    if (existingFeedback) {
      return new NextResponse("Feedback already submitted", { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        bookingId,
        userId,
        rating,
        comment,
      },
      include: {
        booking: {
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
          },
        },
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("[CLIENT_FEEDBACK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}