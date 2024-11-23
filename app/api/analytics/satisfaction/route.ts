import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { startOfMonth, subMonths, format } from "date-fns";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const months = parseInt(searchParams.get("months") || "6");

    const satisfactionData = [];
    const today = new Date();

    for (let i = 0; i < months; i++) {
      const date = subMonths(today, i);
      const startDate = startOfMonth(date);
      const endDate = subMonths(startOfMonth(date), -1);

      const monthlyFeedback = await prisma.feedback.aggregate({
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      satisfactionData.unshift({
        month: format(date, "MMM yyyy"),
        rating: monthlyFeedback._avg.rating || 0,
        responses: monthlyFeedback._count.rating || 0,
      });
    }

    return NextResponse.json(satisfactionData);
  } catch (error) {
    console.error("[ANALYTICS_SATISFACTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}