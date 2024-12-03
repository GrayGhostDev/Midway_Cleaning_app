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

    if (!userRole || userRole !== "CLIENT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("[CLIENT_SERVICES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}