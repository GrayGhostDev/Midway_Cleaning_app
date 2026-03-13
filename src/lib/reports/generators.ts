// Report generators -- jsPDF is not installed, ExcelJS is available.
// PDF generation is stubbed; install jspdf when PDF export is needed.

import ExcelJS from 'exceljs';
import { format } from 'date-fns';

export async function generateReport(report: { format: string; template: { name: string; type: string }; data: any }): Promise<Buffer> {
  switch (report.format) {
    case 'PDF':
      return generatePDF(report);
    case 'EXCEL':
      return generateExcel(report);
    default:
      throw new Error(`Unsupported report format: ${report.format}`);
  }
}

export async function generatePDF(report: { template: { name: string; type: string }; data: any }): Promise<Buffer> {
  // Stub -- jsPDF not installed. Return a simple text buffer.
  const text = `Report: ${report.template.name}\nGenerated: ${format(new Date(), 'PPpp')}\nType: ${report.template.type}\n\n(PDF generation requires jspdf package)`;
  return Buffer.from(text, 'utf-8');
}

export async function generateExcel(report: { template: { name: string; type: string }; data: any }): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report Data');

  worksheet.addRow([report.template.name]);
  worksheet.addRow([`Generated: ${format(new Date(), 'PPpp')}`]);
  worksheet.addRow([]);

  switch (report.template.type) {
    case 'PERFORMANCE':
      addPerformanceSheet(worksheet, report.data);
      break;
    case 'INVENTORY':
      addInventorySheet(worksheet, report.data);
      break;
    case 'MAINTENANCE':
      addMaintenanceSheet(worksheet, report.data);
      break;
    case 'FINANCIAL':
      addFinancialSheet(worksheet, report.data);
      break;
  }

  return workbook.xlsx.writeBuffer() as Promise<Buffer & ArrayBufferLike>;
}

export function convertToCSV(data: Record<string, unknown>[]): string {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

function addPerformanceSheet(worksheet: ExcelJS.Worksheet, data: any) {
  worksheet.addRow(['Metric', 'Value', 'Unit']);
  for (const metric of data?.metrics ?? []) {
    worksheet.addRow([metric.name, metric.value, metric.unit]);
  }
}

function addInventorySheet(_worksheet: ExcelJS.Worksheet, _data: any) {
  // Placeholder
}

function addMaintenanceSheet(_worksheet: ExcelJS.Worksheet, _data: any) {
  // Placeholder
}

function addFinancialSheet(_worksheet: ExcelJS.Worksheet, _data: any) {
  // Placeholder
}
