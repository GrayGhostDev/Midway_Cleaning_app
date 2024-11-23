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

    const feedback = await prisma.feedback.findMany({
      where: {
        clientId: session.user.id,
      },
      include: {
        booking: {
          include: {
            service: true,
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
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { bookingId, rating, comment, category } = body;

    if (!bookingId || !rating || !comment || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: {
        id: bookingId,
        clientId: session.user.id,
        status: "COMPLETED",
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
        clientId: session.user.id,
        rating,
        comment,
        category,
      },
      include: {
        booking: {
          include: {
            service: true,
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