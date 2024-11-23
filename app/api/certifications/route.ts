import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const where = userId ? { userId } : {};

    const certifications = await prisma.certification.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error("[CERTIFICATIONS_GET]", error);
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
    const { name, userId, issuedDate, expiryDate } = body;

    if (!name || !userId || !issuedDate || !expiryDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const certification = await prisma.certification.create({
      data: {
        name,
        userId,
        issuedDate: new Date(issuedDate),
        expiryDate: new Date(expiryDate),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(certification);
  } catch (error) {
    console.error("[CERTIFICATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}