import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const mockEquipment = [
  {
    id: 1,
    name: "Industrial Vacuum Cleaner",
    type: "Vacuum",
    serialNumber: "VAC001",
    manufacturer: "CleanTech",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2024-01-15",
    status: "Available",
    location: "Main Storage",
    maintenanceHistory: [],
    specifications: {
      power: "1200W",
      capacity: "30L",
    },
  },
  {
    id: 2,
    name: "Floor Scrubber",
    type: "Scrubber",
    serialNumber: "SCR002",
    manufacturer: "FloorMaster",
    purchaseDate: "2023-02-20",
    warrantyExpiry: "2024-02-20",
    status: "In Use",
    location: "Building A",
    maintenanceHistory: [],
    specifications: {
      width: "20 inches",
      tankCapacity: "10 gallons",
    },
  },
];

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const location = searchParams.get("location");

    // Filter equipment based on query parameters
    let filteredEquipment = [...mockEquipment];
    if (type) {
      filteredEquipment = filteredEquipment.filter(e => e.type.toLowerCase() === type.toLowerCase());
    }
    if (status) {
      filteredEquipment = filteredEquipment.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }
    if (location) {
      filteredEquipment = filteredEquipment.filter(e => e.location.toLowerCase() === location.toLowerCase());
    }

    return new NextResponse(
      JSON.stringify(filteredEquipment),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in equipment API:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
