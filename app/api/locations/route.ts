import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const locations = await prisma.location.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
            shifts: true,
          },
        },
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("[LOCATIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, address, type, size } = body;

    if (!name || !address || !type || !size) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        name,
        address,
        type,
        size,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("[LOCATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}