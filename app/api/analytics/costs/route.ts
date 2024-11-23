import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new NextResponse("Date range required", { status: 400 });
    }

    // Equipment maintenance costs
    const maintenanceCosts = await prisma.maintenanceLog.aggregate({
      _sum: {
        cost: true,
      },
      where: {
        performedAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    // Supply costs
    const supplyCosts = await prisma.inventoryTransaction.aggregate({
      _sum: {
        cost: true,
      },
      where: {
        type: "IN",
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    // Labor costs (simplified calculation)
    const laborHours = await prisma.shift.aggregate({
      _sum: {
        duration: true,
      },
      where: {
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    const AVERAGE_HOURLY_RATE = 15; // This should come from configuration
    const laborCost = (laborHours._sum.duration || 0) * AVERAGE_HOURLY_RATE;

    const costData = [
      {
        category: "Equipment Maintenance",
        actual: maintenanceCosts._sum.cost || 0,
        projected: calculateProjectedCost("maintenance", maintenanceCosts._sum.cost || 0),
      },
      {
        category: "Supplies",
        actual: supplyCosts._sum.cost || 0,
        projected: calculateProjectedCost("supplies", supplyCosts._sum.cost || 0),
      },
      {
        category: "Labor",
        actual: laborCost,
        projected: calculateProjectedCost("labor", laborCost),
      },
    ];

    return NextResponse.json(costData);
  } catch (error) {
    console.error("[ANALYTICS_COSTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function calculateProjectedCost(category: string, actualCost: number): number {
  // Implement projected cost calculation based on historical data and trends
  // This is a simplified example
  const projectionFactors = {
    maintenance: 1.1, // 10% increase
    supplies: 1.15,   // 15% increase
    labor: 1.05,      // 5% increase
  };

  return actualCost * projectionFactors[category as keyof typeof projectionFactors];
}