import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await clerkClient.users.getUser(currentUserId);
    const userRole = currentUser.publicMetadata.role as string;

    // Only allow admins, managers, or the user themselves to view user details
    if (!userRole || 
        (!["ADMIN", "MANAGER"].includes(userRole) && currentUserId !== params.userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    // Get user from Clerk
    const user = await clerkClient.users.getUser(params.userId);

    // Map Clerk user to our application's user format
    const mappedUser = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata.role || "CLIENT",
      isActive: user.publicMetadata.isActive !== false, // default to true if not set
      phoneNumber: user.phoneNumbers[0]?.phoneNumber,
    };

    return NextResponse.json(mappedUser);
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
    const { userId: currentUserId } = auth();
    
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await clerkClient.users.getUser(currentUserId);
    const userRole = currentUser.publicMetadata.role as string;

    // Only allow admins or the user themselves to update user details
    if (!userRole || 
        (userRole !== "ADMIN" && currentUserId !== params.userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const body = await req.json();
    const { firstName, lastName, email, role, isActive, phoneNumber } = body;

    try {
      // Update user in Clerk
      const updatedUser = await clerkClient.users.updateUser(params.userId, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        publicMetadata: {
          role: role || userRole, // Preserve existing role if not updating
          isActive: isActive === undefined ? currentUser.publicMetadata.isActive : isActive,
        },
      });

      // Update email if provided
      if (email) {
        const primaryEmail = updatedUser.emailAddresses[0];
        if (primaryEmail) {
          await clerkClient.users.updateUserMetadata(params.userId, {
            privateMetadata: {
              ...updatedUser.privateMetadata,
              primaryEmail: email,
            },
          });
        } else {
          await clerkClient.emailAddresses.createEmailAddress({
            userId: params.userId,
            emailAddress: email,
          });
        }
      }

      // Update phone if provided
      if (phoneNumber) {
        const primaryPhone = updatedUser.phoneNumbers[0];
        if (primaryPhone) {
          await clerkClient.users.updateUserMetadata(params.userId, {
            privateMetadata: {
              ...updatedUser.privateMetadata,
              primaryPhone: phoneNumber,
            },
          });
        } else {
          await clerkClient.phoneNumbers.createPhoneNumber({
            userId: params.userId,
            phoneNumber: phoneNumber,
          });
        }
      }

      // Map updated Clerk user to our application's user format
      const mappedUser = {
        id: updatedUser.id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        email: updatedUser.emailAddresses[0]?.emailAddress,
        role: updatedUser.publicMetadata.role || "CLIENT",
        isActive: updatedUser.publicMetadata.isActive !== false,
        phoneNumber: updatedUser.phoneNumbers[0]?.phoneNumber,
      };

      return NextResponse.json(mappedUser);
    } catch (updateError) {
      console.error("[USER_UPDATE]", updateError);
      return new NextResponse("Error updating user", { status: 500 });
    }
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
    const { userId: currentUserId } = auth();
    
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await clerkClient.users.getUser(currentUserId);
    const userRole = currentUser.publicMetadata.role as string;

    // Only allow admins to delete users
    if (!userRole || userRole !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    // Instead of deleting, we'll deactivate the user
    const updatedUser = await clerkClient.users.updateUser(params.userId, {
      publicMetadata: {
        ...currentUser.publicMetadata,
        isActive: false,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      deactivated: true,
    });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}