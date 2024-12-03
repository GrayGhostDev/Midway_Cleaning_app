import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

// Define types for our certifications
interface Certification {
  id: string;
  name: string;
  issuedDate: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

// Define type for user metadata
interface UserMetadata {
  role?: string;
  profile?: any;
  certifications?: Certification[];
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    // If a specific user's certifications are requested
    if (userIdParam) {
      const user = await clerkClient.users.getUser(userIdParam);
      const metadata = user.publicMetadata as UserMetadata;
      const certifications = metadata.certifications || [];
      return NextResponse.json(certifications);
    }

    // If no specific user, return all certifications (for admins/managers)
    const currentUser = await clerkClient.users.getUser(userId);
    const userRole = (currentUser.publicMetadata as UserMetadata).role;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all users and their certifications
    const users = await clerkClient.users.getUserList();
    const allCertifications = users.flatMap(user => {
      const metadata = user.publicMetadata as UserMetadata;
      const certs = metadata.certifications || [];
      return certs.map(cert => ({
        ...cert,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.emailAddresses[0]?.emailAddress,
        },
      }));
    });

    // Sort by expiry date
    allCertifications.sort((a, b) => 
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );

    return NextResponse.json(allCertifications);
  } catch (error) {
    console.error("[CERTIFICATIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await clerkClient.users.getUser(userId);
    const userRole = (currentUser.publicMetadata as UserMetadata).role;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, userId: userIdParam, issuedDate, expiryDate } = body;

    if (!name || !userIdParam || !issuedDate || !expiryDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get the target user
    const targetUser = await clerkClient.users.getUser(userIdParam);
    const metadata = targetUser.publicMetadata as UserMetadata;
    
    // Create new certification object
    const newCertification: Certification = {
      id: crypto.randomUUID(),
      name,
      issuedDate: new Date(issuedDate).toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Get existing certifications and add the new one
    const existingCertifications = metadata.certifications || [];
    const updatedCertifications = [...existingCertifications, newCertification];

    // Update user's metadata with new certification
    const updatedUser = await clerkClient.users.updateUser(userIdParam, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        certifications: updatedCertifications,
      },
    });

    // Return the new certification with user info
    const certificationWithUser = {
      ...newCertification,
      user: {
        id: updatedUser.id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        email: updatedUser.emailAddresses[0]?.emailAddress,
      },
    };

    return NextResponse.json(certificationWithUser);
  } catch (error) {
    console.error("[CERTIFICATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}