import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.locationId) {
      return new NextResponse("Location ID required", { status: 400 });
    }

    const location = await prisma.location.findUnique({
      where: {
        id: params.locationId,
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        shifts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("[LOCATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, address, type, size } = body;

    if (!params.locationId) {
      return new NextResponse("Location ID required", { status: 400 });
    }

    const location = await prisma.location.update({
      where: {
        id: params.locationId,
      },
      data: {
        name,
        address,
        type,
        size,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("[LOCATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.locationId) {
      return new NextResponse("Location ID required", { status: 400 });
    }

    const location = await prisma.location.delete({
      where: {
        id: params.locationId,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("[LOCATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}