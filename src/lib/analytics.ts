import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

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
  // Get revenue data
  const revenue = await prisma.payment.groupBy({
    by: ['createdAt'],
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'completed',
    },
  });

  // Get appointment data
  const appointments = await prisma.appointment.groupBy({
    by: ['createdAt'],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Get customer data
  const customers = await prisma.customer.groupBy({
    by: ['createdAt'],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Get service data
  const services = await prisma.service.groupBy({
    by: ['createdAt'],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Combine and format data
  const analyticsData = new Map<string, AnalyticsData>();

  // Process revenue
  revenue.forEach((item) => {
    const date = format(item.createdAt, 'yyyy-MM-dd');
    if (!analyticsData.has(date)) {
      analyticsData.set(date, {
        revenue: 0,
        appointments: 0,
        customers: 0,
        services: 0,
        timestamp: item.createdAt,
      });
    }
    const data = analyticsData.get(date)!;
    data.revenue += item._sum.amount || 0;
  });

  // Process appointments
  appointments.forEach((item) => {
    const date = format(item.createdAt, 'yyyy-MM-dd');
    if (!analyticsData.has(date)) {
      analyticsData.set(date, {
        revenue: 0,
        appointments: 0,
        customers: 0,
        services: 0,
        timestamp: item.createdAt,
      });
    }
    const data = analyticsData.get(date)!;
    data.appointments += item._count.id;
  });

  // Process customers
  customers.forEach((item) => {
    const date = format(item.createdAt, 'yyyy-MM-dd');
    if (!analyticsData.has(date)) {
      analyticsData.set(date, {
        revenue: 0,
        appointments: 0,
        customers: 0,
        services: 0,
        timestamp: item.createdAt,
      });
    }
    const data = analyticsData.get(date)!;
    data.customers += item._count.id;
  });

  // Process services
  services.forEach((item) => {
    const date = format(item.createdAt, 'yyyy-MM-dd');
    if (!analyticsData.has(date)) {
      analyticsData.set(date, {
        revenue: 0,
        appointments: 0,
        customers: 0,
        services: 0,
        timestamp: item.createdAt,
      });
    }
    const data = analyticsData.get(date)!;
    data.services += item._count.id;
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
      format(item.timestamp, 'yyyy-MM-dd'),
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
      date: format(item.timestamp, 'yyyy-MM-dd'),
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
      format(item.timestamp, 'yyyy-MM-dd'),
      item.revenue,
      item.appointments,
      item.customers,
      item.services,
    ]),
  ];
  
  return stringify(rows);
}
