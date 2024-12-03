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
    const invoiceId = searchParams.get('invoiceId');

    let whereClause: any = {};
    if (invoiceId) whereClause.invoiceId = invoiceId;

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        invoice: {
          select: {
            number: true,
            client: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
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
    const { invoiceId, amount, method, transactionId, notes } = body;

    // Verify invoice exists and payment amount is valid
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        payments: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Calculate total paid amount
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = invoice.amount - totalPaid;

    if (amount > remainingAmount) {
      return NextResponse.json(
        { error: 'Payment amount exceeds remaining balance' },
        { status: 400 }
      );
    }

    // Create the payment
    const payment = await prisma.$transaction(async (prisma) => {
      const payment = await prisma.payment.create({
        data: {
          invoiceId,
          amount,
          method,
          status: 'COMPLETED', // You might want to handle different statuses based on payment method
          transactionId,
          notes,
        },
      });

      // Update invoice status if fully paid
      if (totalPaid + amount >= invoice.amount) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID' },
        });
      }

      return payment;
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
