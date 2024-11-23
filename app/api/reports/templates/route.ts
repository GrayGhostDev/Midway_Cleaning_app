import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const templates = await prisma.reportTemplate.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("[REPORT_TEMPLATES_GET]", error);
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
    const { name, description, type, format, parameters, schedule } = body;

    if (!name || !type || !format) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const template = await prisma.reportTemplate.create({
      data: {
        name,
        description,
        type,
        format,
        parameters: parameters || {},
        schedule: schedule || null,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("[REPORT_TEMPLATES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}