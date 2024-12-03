import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get current date metrics
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Active tasks count
    const activeTasks = await prisma.task.count({
      where: {
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
      },
    });

    // Staff on duty
    const employeesOnDuty = await prisma.shift.count({
      where: {
        startTime: {
          lte: new Date(),
        },
        endTime: {
          gte: new Date(),
        },
      },
    });

    // Completed tasks today
    const completedToday = await prisma.task.count({
      where: {
        status: "COMPLETED",
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Average customer rating
    const ratings = await prisma.feedback.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(today.getDate() - 30)), // Last 30 days
        },
      },
    });

    // Calculate trends
    const previousPeriod = {
      tasks: await calculateTrend("tasks"),
      employees: await calculateTrend("employees"),
      completion: await calculateTrend("completion"),
      rating: await calculateTrend("rating"),
    };

    return NextResponse.json({
      activeTasks,
      employeesOnDuty,
      completedToday,
      customerRating: ratings._avg.rating || 0,
      trends: previousPeriod,
    });
  } catch (error) {
    console.error("[ANALYTICS_DASHBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function calculateTrend(metric: string): Promise<string> {
  // Implement trend calculation logic based on historical data
  // This is a placeholder that should be replaced with actual calculations
  return "+5%";
}