import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { certificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.certificationId) {
      return new NextResponse("Certification ID required", { status: 400 });
    }

    const certification = await prisma.certification.findUnique({
      where: {
        id: params.certificationId,
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
    console.error("[CERTIFICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { certificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, issuedDate, expiryDate } = body;

    if (!params.certificationId) {
      return new NextResponse("Certification ID required", { status: 400 });
    }

    const certification = await prisma.certification.update({
      where: {
        id: params.certificationId,
      },
      data: {
        name,
        issuedDate: issuedDate ? new Date(issuedDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
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
    console.error("[CERTIFICATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { certificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.certificationId) {
      return new NextResponse("Certification ID required", { status: 400 });
    }

    const certification = await prisma.certification.delete({
      where: {
        id: params.certificationId,
      },
    });

    return NextResponse.json(certification);
  } catch (error) {
    console.error("[CERTIFICATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}