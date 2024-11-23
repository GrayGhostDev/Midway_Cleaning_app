import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
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
      case "inventory":
        reportData = await generateInventoryReport(startDate, endDate);
        break;
      case "maintenance":
        reportData = await generateMaintenanceReport(startDate, endDate);
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
      assignee: {
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
    employeePerformance: calculateEmployeePerformance(tasks),
  };
}

async function generateInventoryReport(startDate: string, endDate: string) {
  const transactions = await prisma.inventoryTransaction.findMany({
    where: {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      item: true,
    },
  });

  const currentInventory = await prisma.inventoryItem.findMany({
    include: {
      location: true,
    },
  });

  return {
    transactions: {
      total: transactions.length,
      inflow: transactions.filter(t => t.type === "IN").length,
      outflow: transactions.filter(t => t.type === "OUT").length,
    },
    currentStock: {
      total: currentInventory.length,
      lowStock: currentInventory.filter(i => i.status === "LOW_STOCK").length,
      outOfStock: currentInventory.filter(i => i.status === "OUT_OF_STOCK").length,
    },
    locationBreakdown: calculateLocationBreakdown(currentInventory),
  };
}

async function generateMaintenanceReport(startDate: string, endDate: string) {
  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    where: {
      performedAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      equipment: true,
    },
  });

  return {
    totalMaintenance: maintenanceLogs.length,
    byType: {
      routine: maintenanceLogs.filter(l => l.type === "ROUTINE").length,
      repair: maintenanceLogs.filter(l => l.type === "REPAIR").length,
      inspection: maintenanceLogs.filter(l => l.type === "INSPECTION").length,
    },
    totalCost: maintenanceLogs.reduce((acc, log) => acc + log.cost, 0),
    equipmentBreakdown: calculateEquipmentBreakdown(maintenanceLogs),
  };
}

async function generateFinancialReport(startDate: string, endDate: string) {
  // Implement financial report generation
  // This would typically include revenue, expenses, profitability metrics, etc.
  return {
    // Financial metrics would go here
  };
}

function calculateEmployeePerformance(tasks: any[]) {
  const performance: Record<string, any> = {};
  
  tasks.forEach(task => {
    if (!task.assignee) return;
    
    if (!performance[task.assignee.id]) {
      performance[task.assignee.id] = {
        name: task.assignee.name,
        total: 0,
        completed: 0,
      };
    }
    
    performance[task.assignee.id].total++;
    if (task.status === "COMPLETED") {
      performance[task.assignee.id].completed++;
    }
  });

  return Object.values(performance).map(p => ({
    ...p,
    completionRate: (p.completed / p.total) * 100,
  }));
}

function calculateLocationBreakdown(inventory: any[]) {
  const breakdown: Record<string, any> = {};
  
  inventory.forEach(item => {
    if (!item.location) return;
    
    if (!breakdown[item.location.id]) {
      breakdown[item.location.id] = {
        name: item.location.name,
        itemCount: 0,
        totalValue: 0,
      };
    }
    
    breakdown[item.location.id].itemCount++;
    // Add value calculation if items have value/cost properties
  });

  return Object.values(breakdown);
}

function calculateEquipmentBreakdown(logs: any[]) {
  const breakdown: Record<string, any> = {};
  
  logs.forEach(log => {
    if (!log.equipment) return;
    
    if (!breakdown[log.equipment.id]) {
      breakdown[log.equipment.id] = {
        name: log.equipment.name,
        maintenanceCount: 0,
        totalCost: 0,
      };
    }
    
    breakdown[log.equipment.id].maintenanceCount++;
    breakdown[log.equipment.id].totalCost += log.cost;
  });

  return Object.values(breakdown);
}

function convertToCSV(data: any): string {
  // Implement CSV conversion logic
  // This would convert the JSON data to CSV format
  return ""; // Placeholder
}