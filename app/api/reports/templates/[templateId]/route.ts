import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.templateId) {
      return new NextResponse("Template ID required", { status: 400 });
    }

    const template = await prisma.reportTemplate.findUnique({
      where: {
        id: params.templateId,
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

    if (!template) {
      return new NextResponse("Template not found", { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("[REPORT_TEMPLATE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, parameters, schedule } = body;

    if (!params.templateId) {
      return new NextResponse("Template ID required", { status: 400 });
    }

    const template = await prisma.reportTemplate.update({
      where: {
        id: params.templateId,
      },
      data: {
        name,
        description,
        parameters,
        schedule,
        updatedAt: new Date(),
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
    console.error("[REPORT_TEMPLATE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.templateId) {
      return new NextResponse("Template ID required", { status: 400 });
    }

    const template = await prisma.reportTemplate.delete({
      where: {
        id: params.templateId,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("[REPORT_TEMPLATE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}