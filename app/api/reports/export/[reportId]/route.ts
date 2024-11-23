import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { generatePDF, generateExcel, convertToCSV } from "@/lib/reports/generators";
import { uploadToStorage } from "@/lib/storage";

export async function POST(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { format } = body;

    if (!params.reportId || !format) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: {
        id: params.reportId,
      },
      include: {
        template: true,
      },
    });

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    let exportData: Buffer;
    let contentType: string;
    let filename: string;

    switch (format.toLowerCase()) {
      case "pdf":
        exportData = await generatePDF(report);
        contentType = "application/pdf";
        filename = `${report.template.name}-${report.id}.pdf`;
        break;
      case "excel":
        exportData = await generateExcel(report);
        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename = `${report.template.name}-${report.id}.xlsx`;
        break;
      case "csv":
        exportData = Buffer.from(convertToCSV(report.data));
        contentType = "text/csv";
        filename = `${report.template.name}-${report.id}.csv`;
        break;
      default:
        return new NextResponse("Unsupported format", { status: 400 });
    }

    // Upload to storage and get download URL
    const downloadUrl = await uploadToStorage(filename, exportData, contentType);

    // Update report with export information
    await prisma.report.update({
      where: {
        id: params.reportId,
      },
      data: {
        exports: {
          create: {
            format,
            url: downloadUrl,
            createdById: session.user.id,
          },
        },
      },
    });

    return NextResponse.json({ url: downloadUrl });
  } catch (error) {
    console.error("[REPORT_EXPORT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}