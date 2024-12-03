import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  console.error("Unhandled error:", error);
  
  return NextResponse.json(
    {
      error: {
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
      },
    },
    { status: 500 }
  );
};
