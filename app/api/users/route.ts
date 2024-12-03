import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { AppError, handleError } from "@/lib/error-handler";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (!userRole || !["ADMIN", "MANAGER"].includes(userRole)) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    // Get all Clerk users
    const users = await clerkClient.users.getUserList();

    // Map Clerk users to our application's user format
    const mappedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata.role || "CLIENT",
      isActive: user.publicMetadata.isActive !== false,
      phoneNumber: user.phoneNumbers[0]?.phoneNumber,
      createdAt: user.createdAt,
    }));

    return NextResponse.json(mappedUsers);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const adminUser = await clerkClient.users.getUser(userId);
    const adminRole = adminUser.publicMetadata.role as string;

    if (!adminRole || adminRole !== "ADMIN") {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const { email, password, firstName, lastName, role, phoneNumber } = body;

    if (!email || !password || !firstName) {
      throw new AppError("Missing required fields", 400, "INVALID_REQUEST");
    }

    try {
      // Create a new user in Clerk
      const newUser = await clerkClient.users.createUser({
        emailAddress: [email],
        password,
        firstName,
        lastName: lastName || "",
        publicMetadata: {
          role: role || "CLIENT",
          isActive: true,
        },
      });

      // Add phone number if provided
      if (phoneNumber) {
        await clerkClient.phoneNumbers.createPhoneNumber({
          userId: newUser.id,
          phoneNumber,
        });
      }

      // Map the Clerk user to our application's user format
      const mappedUser = {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`.trim(),
        email: newUser.emailAddresses[0]?.emailAddress,
        role: newUser.publicMetadata.role || "CLIENT",
        isActive: true,
        phoneNumber: newUser.phoneNumbers[0]?.phoneNumber,
      };

      return NextResponse.json(mappedUser);
    } catch (createError) {
      console.error("[USER_CREATE]", createError);
      throw new AppError(
        (createError as Error).message || "Failed to create user",
        400,
        "USER_CREATE_ERROR"
      );
    }
  } catch (error) {
    console.error("[USERS_POST]", error);
    return handleError(error);
  }
}