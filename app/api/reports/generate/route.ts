import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { generateReport } from "@/lib/reports/generators";
import { uploadToStorage } from "@/lib/storage";
import { sendReportEmail } from "@/lib/email/sender";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { templateId, parameters, format = "pdf", notify = true } = body;

    if (!templateId) {
      return new NextResponse("Template ID required", { status: 400 });
    }

    const template = await prisma.reportTemplate.findUnique({
      where: { id: templateId },
      include: {
        schedule: true,
      },
    });

    if (!template) {
      return new NextResponse("Template not found", { status: 404 });
    }

    // Generate report data
    const reportData = await generateReportData(template.type, parameters);

    // Create report record
    const report = await prisma.report.create({
      data: {
        templateId,
        data: reportData,
        format,
        generatedById: session.user.id,
        scheduleId: template.schedule?.id,
      },
      include: {
        template: true,
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Generate report file
    const reportFile = await generateReport(report, format);

    // Upload to storage
    const filename = `${template.name}-${report.id}.${format}`;
    const contentType = getContentType(format);
    const downloadUrl = await uploadToStorage(filename, reportFile, contentType);

    // Create export record
    const exportRecord = await prisma.reportExport.create({
      data: {
        reportId: report.id,
        format,
        url: downloadUrl,
        createdById: session.user.id,
      },
    });

    // Send notification if requested
    if (notify && template.schedule?.recipients?.length) {
      await sendReportEmail({
        to: template.schedule.recipients,
        subject: `Report Ready: ${template.name}`,
        templateName: "report-ready",
        data: {
          reportName: template.name,
          reportType: template.type,
          generatedDate: new Date().toISOString(),
          reportPeriod: getReportPeriod(parameters),
          viewUrl: downloadUrl,
          logoUrl: process.env.COMPANY_LOGO_URL,
        },
      });

      await prisma.report.update({
        where: { id: report.id },
        data: {
          notifiedAt: new Date(),
          notifiedRecipients: template.schedule.recipients,
        },
      });
    }

    return NextResponse.json({
      reportId: report.id,
      downloadUrl,
      exportId: exportRecord.id,
    });
  } catch (error) {
    console.error("[REPORT_GENERATE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function generateReportData(type: string, parameters: any) {
  // Generate report data based on type and parameters
  switch (type) {
    case "PERFORMANCE":
      return generatePerformanceData(parameters);
    case "INVENTORY":
      return generateInventoryData(parameters);
    case "MAINTENANCE":
      return generateMaintenanceData(parameters);
    case "FINANCIAL":
      return generateFinancialData(parameters);
    default:
      throw new Error(`Unsupported report type: ${type}`);
  }
}

function getContentType(format: string): string {
  switch (format.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "excel":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "csv":
      return "text/csv";
    default:
      return "application/octet-stream";
  }
}

function getReportPeriod(parameters: any): string {
  if (!parameters?.startDate || !parameters?.endDate) {
    return "Custom Period";
  }
  return `${new Date(parameters.startDate).toLocaleDateString()} - ${new Date(parameters.endDate).toLocaleDateString()}`;
}

// Data generation functions for different report types
async function generatePerformanceData(parameters: any) {
  // Implementation for performance data generation
  return {};
}

async function generateInventoryData(parameters: any) {
  // Implementation for inventory data generation
  return {};
}

async function generateMaintenanceData(parameters: any) {
  // Implementation for maintenance data generation
  return {};
}

async function generateFinancialData(parameters: any) {
  // Implementation for financial data generation
  return {};
}