import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Staff utilization
    const totalStaff = await prisma.user.count({
      where: {
        role: "EMPLOYEE",
      },
    });

    const activeStaff = await prisma.shift.count({
      where: {
        startTime: {
          lte: new Date(),
        },
        endTime: {
          gte: new Date(),
        },
      },
    });

    // Equipment utilization
    const totalEquipment = await prisma.equipment.count();
    const inUseEquipment = await prisma.equipment.count({
      where: {
        status: "IN_USE",
      },
    });

    // Supplies utilization
    const supplies = await prisma.inventoryItem.findMany({
      where: {
        category: "SUPPLIES",
      },
      select: {
        quantity: true,
        minQuantity: true,
      },
    });

    const suppliesUtilization = calculateSuppliesUtilization(supplies);

    // Vehicle utilization (if applicable)
    const totalVehicles = await prisma.equipment.count({
      where: {
        type: "VEHICLE",
      },
    });

    const inUseVehicles = await prisma.equipment.count({
      where: {
        type: "VEHICLE",
        status: "IN_USE",
      },
    });

    const resourceData = [
      {
        subject: "Staff",
        current: (activeStaff / totalStaff) * 100,
        optimal: 85,
      },
      {
        subject: "Equipment",
        current: (inUseEquipment / totalEquipment) * 100,
        optimal: 90,
      },
      {
        subject: "Supplies",
        current: suppliesUtilization,
        optimal: 85,
      },
      {
        subject: "Vehicles",
        current: totalVehicles ? (inUseVehicles / totalVehicles) * 100 : 0,
        optimal: 80,
      },
    ];

    return NextResponse.json(resourceData);
  } catch (error) {
    console.error("[ANALYTICS_RESOURCES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function calculateSuppliesUtilization(supplies: any[]): number {
  if (!supplies.length) return 0;
  
  const utilization = supplies.reduce((acc, supply) => {
    const ratio = supply.quantity / supply.minQuantity;
    return acc + (ratio >= 1 ? 100 : ratio * 100);
  }, 0);

  return utilization / supplies.length;
}