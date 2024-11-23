import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { hash } from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
        tasks: true,
        shifts: true,
        certifications: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.id !== params.userId && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role, profile } = body;

    if (!params.userId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const updateData: any = {
      name,
      email,
      role,
    };

    if (password) {
      updateData.password = await hash(password, 12);
    }

    if (profile) {
      updateData.profile = {
        upsert: {
          create: profile,
          update: profile,
        },
      };
    }

    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const user = await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}