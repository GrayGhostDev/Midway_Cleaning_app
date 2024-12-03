import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getToken, userId } = auth();
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      );
    }

    const token = await getToken({
      template: "default"
    });

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "No token provided" }),
        { status: 401 }
      );
    }

    return new NextResponse(
      JSON.stringify({ token }),
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error getting token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
