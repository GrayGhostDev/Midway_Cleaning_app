import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Staff utilization
    const totalStaff = await prisma.user.count({
      where: {
        role: "CLEANER",
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

    const totalVehicles = await prisma.equipment.count({
      where: {
        category: "VEHICLE",
      },
    });

    const activeVehicles = await prisma.equipment.count({
      where: {
        category: "VEHICLE",
        status: "ACTIVE",
      },
    });

    const vehicleUtilization = (activeVehicles / totalVehicles) * 100;

    const cleaningEquipment = await prisma.equipment.count({
      where: {
        category: "CLEANING_EQUIPMENT",
        status: "ACTIVE",
      },
    });

    // Supplies utilization
    const supplies = await prisma.inventoryItem.findMany({
      where: {
        category: "SUPPLIES",
      },
      select: {
        currentQuantity: true,
        minQuantity: true,
      },
    });

    const suppliesUtilization = calculateSuppliesUtilization(supplies);

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
        current: totalVehicles ? vehicleUtilization : 0,
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
    const ratio = supply.currentQuantity / supply.minQuantity;
    return acc + (ratio >= 1 ? 100 : ratio * 100);
  }, 0);

  return utilization / supplies.length;
}