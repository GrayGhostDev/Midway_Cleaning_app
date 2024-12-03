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

export async function GET(
  req: Request,
  { params }: { params: { certificationId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.certificationId) {
      return new NextResponse("Certification ID required", { status: 400 });
    }

    // Get all users and find the one with the matching certification
    const users = await clerkClient.users.getUserList();
    let foundCertification: Certification | null = null;
    let foundUser = null;

    for (const user of users) {
      const metadata = user.publicMetadata as UserMetadata;
      const certifications = metadata.certifications || [];
      const certification = certifications.find(cert => cert.id === params.certificationId);
      if (certification) {
        foundCertification = certification;
        foundUser = user;
        break;
      }
    }

    if (!foundCertification || !foundUser) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    // Add user information to the certification
    const certificationWithUser = {
      ...foundCertification,
      user: {
        id: foundUser.id,
        name: `${foundUser.firstName} ${foundUser.lastName}`.trim(),
        email: foundUser.emailAddresses[0]?.emailAddress,
      },
    };

    return NextResponse.json(certificationWithUser);
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
    const { name, issuedDate, expiryDate } = body;

    if (!params.certificationId) {
      return new NextResponse("Certification ID required", { status: 400 });
    }

    // Find user with the certification
    const users = await clerkClient.users.getUserList();
    let foundUser = null;
    let certificationIndex = -1;

    for (const user of users) {
      const metadata = user.publicMetadata as UserMetadata;
      const certifications = metadata.certifications || [];
      const index = certifications.findIndex(cert => cert.id === params.certificationId);
      if (index !== -1) {
        foundUser = user;
        certificationIndex = index;
        break;
      }
    }

    if (!foundUser || certificationIndex === -1) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    // Update the certification
    const metadata = foundUser.publicMetadata as UserMetadata;
    const certifications = [...(metadata.certifications || [])];
    certifications[certificationIndex] = {
      ...certifications[certificationIndex],
      name: name || certifications[certificationIndex].name,
      issuedDate: issuedDate ? new Date(issuedDate).toISOString() : certifications[certificationIndex].issuedDate,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : certifications[certificationIndex].expiryDate,
      updatedAt: new Date().toISOString(),
    };

    // Update user's metadata
    const updatedUser = await clerkClient.users.updateUser(foundUser.id, {
      publicMetadata: {
        ...foundUser.publicMetadata,
        certifications,
      },
    });

    // Return updated certification with user info
    const updatedCertification = certifications[certificationIndex];
    const certificationWithUser = {
      ...updatedCertification,
      user: {
        id: updatedUser.id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        email: updatedUser.emailAddresses[0]?.emailAddress,
      },
    };

    return NextResponse.json(certificationWithUser);
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
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await clerkClient.users.getUser(userId);
    const userRole = (currentUser.publicMetadata as UserMetadata).role;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.certificationId) {
      return new NextResponse("Certification ID required", { status: 400 });
    }

    // Find user with the certification
    const users = await clerkClient.users.getUserList();
    let foundUser = null;
    let certificationIndex = -1;

    for (const user of users) {
      const metadata = user.publicMetadata as UserMetadata;
      const certifications = metadata.certifications || [];
      const index = certifications.findIndex(cert => cert.id === params.certificationId);
      if (index !== -1) {
        foundUser = user;
        certificationIndex = index;
        break;
      }
    }

    if (!foundUser || certificationIndex === -1) {
      return new NextResponse("Certification not found", { status: 404 });
    }

    // Remove the certification
    const metadata = foundUser.publicMetadata as UserMetadata;
    const certifications = [...(metadata.certifications || [])];
    const [removedCertification] = certifications.splice(certificationIndex, 1);

    // Update user's metadata
    await clerkClient.users.updateUser(foundUser.id, {
      publicMetadata: {
        ...foundUser.publicMetadata,
        certifications,
      },
    });

    return NextResponse.json(removedCertification);
  } catch (error) {
    console.error("[CERTIFICATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}