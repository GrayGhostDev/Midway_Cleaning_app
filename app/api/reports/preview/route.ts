import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { generatePreview } from "@/lib/reports/preview";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { templateId, parameters, format = "html" } = body;

    if (!templateId) {
      return new NextResponse("Template ID required", { status: 400 });
    }

    const template = await prisma.reportTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return new NextResponse("Template not found", { status: 404 });
    }

    // Generate sample data based on template type
    const sampleData = await generateSampleData(template.type);

    // Generate preview
    const preview = await generatePreview(template, sampleData, format);

    return new NextResponse(preview, {
      headers: {
        "Content-Type": format === "pdf" ? "application/pdf" : "text/html",
      },
    });
  } catch (error) {
    console.error("[REPORT_PREVIEW_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function generateSampleData(type: string) {
  // Generate appropriate sample data based on report type
  switch (type) {
    case "PERFORMANCE":
      return {
        metrics: [
          { name: "Task Completion", value: 85, unit: "%" },
          { name: "Customer Satisfaction", value: 4.5, unit: "stars" },
          { name: "Response Time", value: 24, unit: "minutes" },
        ],
        trends: {
          monthly: [/* sample trend data */],
        },
      };
    case "INVENTORY":
      return {
        stock: [
          { item: "Cleaning Solution", quantity: 150, status: "In Stock" },
          { item: "Paper Towels", quantity: 50, status: "Low Stock" },
        ],
        transactions: [/* sample transaction data */],
      };
    // Add other report types as needed
    default:
      return {};
  }
}