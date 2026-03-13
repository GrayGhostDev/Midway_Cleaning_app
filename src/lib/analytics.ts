import { createServerClient } from '@/lib/supabase';
import { format as formatDate } from 'date-fns';

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type MetricType = 'revenue' | 'appointments' | 'customers' | 'services';

interface AnalyticsData {
  revenue: number;
  appointments: number;
  customers: number;
  services: number;
  timestamp: Date;
}

export async function getAnalytics(timeRange: TimeRange, startDate: Date, endDate: Date) {
  const supabase = createServerClient();
  const start = startDate.toISOString();
  const end = endDate.toISOString();

  const [
    { data: revenueData },
    { data: appointmentData },
    { data: customerData },
    { data: serviceData },
  ] = await Promise.all([
    supabase
      .from('Payment')
      .select('createdAt, amount')
      .gte('createdAt', start)
      .lte('createdAt', end)
      .eq('status', 'PAID'),
    // Bookings map to appointments
    supabase
      .from('Booking')
      .select('createdAt')
      .gte('createdAt', start)
      .lte('createdAt', end),
    // Users (clients) map to customers
    supabase
      .from('User')
      .select('createdAt')
      .eq('role', 'CLIENT')
      .gte('createdAt', start)
      .lte('createdAt', end),
    supabase
      .from('Service')
      .select('createdAt')
      .gte('createdAt', start)
      .lte('createdAt', end),
  ]);

  const analyticsData = new Map<string, AnalyticsData>();

  const getOrCreate = (date: string, timestamp: Date): AnalyticsData => {
    if (!analyticsData.has(date)) {
      analyticsData.set(date, { revenue: 0, appointments: 0, customers: 0, services: 0, timestamp });
    }
    return analyticsData.get(date)!;
  };

  (revenueData ?? []).forEach((item: any) => {
    const ts = new Date(item.createdAt);
    const date = formatDate(ts, 'yyyy-MM-dd');
    const data = getOrCreate(date, ts);
    data.revenue += parseFloat(item.amount) || 0;
  });

  (appointmentData ?? []).forEach((item: any) => {
    const ts = new Date(item.createdAt);
    const date = formatDate(ts, 'yyyy-MM-dd');
    const data = getOrCreate(date, ts);
    data.appointments += 1;
  });

  (customerData ?? []).forEach((item: any) => {
    const ts = new Date(item.createdAt);
    const date = formatDate(ts, 'yyyy-MM-dd');
    const data = getOrCreate(date, ts);
    data.customers += 1;
  });

  (serviceData ?? []).forEach((item: any) => {
    const ts = new Date(item.createdAt);
    const date = formatDate(ts, 'yyyy-MM-dd');
    const data = getOrCreate(date, ts);
    data.services += 1;
  });

  return Array.from(analyticsData.values()).sort((a, b) =>
    a.timestamp.getTime() - b.timestamp.getTime()
  );
}

export async function generateReport(timeRange: TimeRange, startDate: Date, endDate: Date, format: 'pdf' | 'excel' | 'csv') {
  const data = await getAnalytics(timeRange, startDate, endDate);
  
  switch (format) {
    case 'pdf':
      return generatePDFReport(data);
    case 'excel':
      return generateExcelReport(data);
    case 'csv':
      return generateCSVReport(data);
    default:
      throw new Error('Unsupported format');
  }
}

async function generatePDFReport(data: AnalyticsData[]) {
  // Implementation using PDFKit
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  
  // Add report header
  doc.fontSize(25).text('Analytics Report', { align: 'center' });
  doc.moveDown();
  
  // Add summary table
  const table = {
    headers: ['Date', 'Revenue', 'Appointments', 'Customers', 'Services'],
    rows: data.map(item => [
      formatDate(item.timestamp, 'yyyy-MM-dd'),
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.revenue),
      item.appointments.toString(),
      item.customers.toString(),
      item.services.toString(),
    ]),
  };
  
  // Generate PDF buffer
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    doc.on('data', chunks.push.bind(chunks));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    
    doc.end();
  });
}

async function generateExcelReport(data: AnalyticsData[]) {
  // Implementation using ExcelJS
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Analytics');
  
  // Add headers
  worksheet.columns = [
    { header: 'Date', key: 'date' },
    { header: 'Revenue', key: 'revenue' },
    { header: 'Appointments', key: 'appointments' },
    { header: 'Customers', key: 'customers' },
    { header: 'Services', key: 'services' },
  ];
  
  // Add data
  data.forEach(item => {
    worksheet.addRow({
      date: formatDate(item.timestamp, 'yyyy-MM-dd'),
      revenue: item.revenue,
      appointments: item.appointments,
      customers: item.customers,
      services: item.services,
    });
  });
  
  // Generate Excel buffer
  return workbook.xlsx.writeBuffer();
}

async function generateCSVReport(data: AnalyticsData[]) {
  // Implementation using csv-stringify
  const { stringify } = require('csv-stringify/sync');
  
  const rows = [
    ['Date', 'Revenue', 'Appointments', 'Customers', 'Services'],
    ...data.map(item => [
      formatDate(item.timestamp, 'yyyy-MM-dd'),
      item.revenue,
      item.appointments,
      item.customers,
      item.services,
    ]),
  ];
  
  return stringify(rows);
}
