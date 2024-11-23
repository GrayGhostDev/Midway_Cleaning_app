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

    const performanceData = [];
    const today = new Date();

    for (let i = 0; i < months; i++) {
      const date = subMonths(today, i);
      const startDate = startOfMonth(date);
      const endDate = subMonths(startOfMonth(date), -1);

      // Task completion rate
      const totalTasks = await prisma.task.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      const completedTasks = await prisma.task.count({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      // Quality metrics (from feedback)
      const qualityMetrics = await prisma.feedback.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      performanceData.unshift({
        month: format(date, "MMM yyyy"),
        taskCompletion: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
        efficiency: calculateEfficiency(completedTasks, totalTasks),
        quality: qualityMetrics._avg.rating ? qualityMetrics._avg.rating * 20 : 0, // Convert 5-star rating to percentage
      });
    }

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error("[ANALYTICS_PERFORMANCE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function calculateEfficiency(completed: number, total: number): number {
  if (!total) return 0;
  // This is a simplified efficiency calculation
  // In a real application, you might want to consider factors like:
  // - Time taken vs. expected time
  // - Resource utilization
  // - Cost efficiency
  return (completed / total) * 100;
}