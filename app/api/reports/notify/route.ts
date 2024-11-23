import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendReportEmail } from "@/lib/email/sender";
import { format } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { reportId, recipients } = body;

    if (!reportId || !recipients?.length) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        template: true,
        exports: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    // Send email notification
    await sendReportEmail({
      to: recipients,
      subject: `Report Ready: ${report.template.name}`,
      templateName: "report-ready",
      data: {
        reportName: report.template.name,
        reportType: report.template.type,
        generatedDate: format(report.createdAt, "PPpp"),
        reportPeriod: "Custom Period", // This should be dynamic based on report parameters
        viewUrl: report.exports[0]?.url || "#",
        logoUrl: process.env.COMPANY_LOGO_URL,
      },
    });

    // Update report notification status
    await prisma.report.update({
      where: { id: reportId },
      data: {
        notifiedAt: new Date(),
        notifiedRecipients: recipients,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REPORT_NOTIFY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}