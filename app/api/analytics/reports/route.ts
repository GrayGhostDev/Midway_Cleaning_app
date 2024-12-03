import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, startDate, endDate, format = "json" } = body;

    if (!type || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let reportData;

    switch (type) {
      case "performance":
        reportData = await generatePerformanceReport(startDate, endDate);
        break;
      case "financial":
        reportData = await generateFinancialReport(startDate, endDate);
        break;
      default:
        return new NextResponse("Invalid report type", { status: 400 });
    }

    // Format the report based on requested format
    if (format === "csv") {
      // Convert to CSV format
      const csv = convertToCSV(reportData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=${type}-report.csv`,
        },
      });
    }

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("[ANALYTICS_REPORTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function generatePerformanceReport(startDate: string, endDate: string) {
  const tasks = await prisma.task.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      cleaner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const feedback = await prisma.feedback.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
  });

  return {
    taskMetrics: {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "COMPLETED").length,
      inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
      pending: tasks.filter(t => t.status === "PENDING").length,
    },
    customerSatisfaction: {
      averageRating: feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length,
      totalFeedback: feedback.length,
    },
    cleanerPerformance: calculateCleanerPerformance(tasks),
  };
}

async function generateFinancialReport(startDate: string, endDate: string) {
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      booking: {
        include: {
          service: true,
        },
      },
    },
  });

  const totalRevenue = payments
    .filter(p => p.status === "PAID")
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const revenueByService = payments
    .filter(p => p.status === "PAID")
    .reduce((acc: Record<string, number>, p) => {
      const serviceName = p.booking?.service?.name || "Unknown";
      acc[serviceName] = (acc[serviceName] || 0) + Number(p.amount);
      return acc;
    }, {});

  const monthlyRevenue = payments
    .filter(p => p.status === "PAID")
    .reduce((acc: Record<string, number>, p) => {
      const month = format(new Date(p.createdAt), "MMM yyyy");
      acc[month] = (acc[month] || 0) + Number(p.amount);
      return acc;
    }, {});

  return {
    totalRevenue,
    revenueByService,
    monthlyRevenue,
    paymentMetrics: {
      total: payments.length,
      paid: payments.filter(p => p.status === "PAID").length,
      pending: payments.filter(p => p.status === "PENDING").length,
      failed: payments.filter(p => p.status === "FAILED").length,
    },
  };
}

function calculateCleanerPerformance(tasks: any[]) {
  const performance: Record<string, any> = {};
  
  tasks.forEach(task => {
    if (!task.cleaner) return;
    
    if (!performance[task.cleaner.id]) {
      performance[task.cleaner.id] = {
        name: task.cleaner.name,
        total: 0,
        completed: 0,
      };
    }
    
    performance[task.cleaner.id].total++;
    if (task.status === "COMPLETED") {
      performance[task.cleaner.id].completed++;
    }
  });

  return Object.values(performance).map(p => ({
    ...p,
    completionRate: (p.completed / p.total) * 100,
  }));
}

function convertToCSV(data: any): string {
  // Implement CSV conversion logic
  return "";
}