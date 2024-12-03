import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function GET(req: Request) {
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

    const maintenanceCostValue = Number(maintenanceCosts._sum.cost || 0);
    const supplyCostValue = Number(supplyCosts._sum.cost || 0);
    const laborHoursValue = Number(laborHours._sum.duration || 0);

    const data = [
      {
        category: "Equipment Maintenance",
        actual: maintenanceCostValue,
        projected: calculateProjectedCost("maintenance", maintenanceCostValue),
      },
      {
        category: "Supplies",
        actual: supplyCostValue,
        projected: calculateProjectedCost("supplies", supplyCostValue),
      },
      {
        category: "Labor",
        actual: laborHoursValue * 15, // Assuming $15/hour average rate
        projected: calculateProjectedCost("labor", laborHoursValue * 15),
      },
    ];

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cost data:", error);
    return NextResponse.json(
      { error: "Failed to fetch cost data" },
      { status: 500 }
    );
  }
}

function calculateProjectedCost(category: string, actualCost: number): number {
  // Simple projection logic - can be made more sophisticated
  const projectionFactors = {
    maintenance: 1.1, // 10% increase
    supplies: 1.15,   // 15% increase
    labor: 1.05,      // 5% increase
  };

  const factor = projectionFactors[category as keyof typeof projectionFactors] || 1;
  return actualCost * factor;
}