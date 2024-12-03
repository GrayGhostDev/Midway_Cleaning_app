import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (clientId) whereClause.clientId = clientId;
    if (status) whereClause.status = status;

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            service: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      items,
      dueDate,
      notes,
    } = body;

    // Calculate total amount from items
    const amount = items.reduce((total: number, item: any) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);

    // Generate invoice number (you might want to implement a more sophisticated system)
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(5, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        clientId,
        amount,
        status: 'DRAFT',
        dueDate: new Date(dueDate),
        notes,
        items: {
          create: items.map((item: any) => ({
            serviceId: item.serviceId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
