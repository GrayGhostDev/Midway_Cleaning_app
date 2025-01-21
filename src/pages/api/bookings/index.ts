import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: { service: true }
      });
      return res.json(bookings);

    case 'POST':
      const booking = await prisma.booking.create({
        data: {
          ...req.body,
          userId
        }
      });
      return res.json(booking);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 