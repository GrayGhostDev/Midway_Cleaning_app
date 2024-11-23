import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { reportId, format } = body;

    if (!reportId || !format) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        generatedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    let exportData;
    switch (format.toLowerCase()) {
      case "csv":
        exportData = convertToCSV(report.data);
        return new NextResponse(exportData, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename=${report.type}-${report.id}.csv`,
          },
        });
      case "pdf":
        exportData = await generatePDF(report);
        return new NextResponse(exportData, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${report.type}-${report.id}.pdf`,
          },
        });
      case "excel":
        exportData = generateExcel(report.data);
        return new NextResponse(exportData, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename=${report.type}-${report.id}.xlsx`,
          },
        });
      default:
        return new NextResponse("Unsupported format", { status: 400 });
    }
  } catch (error) {
    console.error("[REPORT_EXPORT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function convertToCSV(data: any): string {
  // Implement CSV conversion
  return "";
}

async function generatePDF(report: any): Promise<Buffer> {
  // Implement PDF generation
  return Buffer.from("");
}

function generateExcel(data: any): Buffer {
  // Implement Excel generation
  return Buffer.from("");
}