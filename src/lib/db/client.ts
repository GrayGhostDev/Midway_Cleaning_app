import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
  });
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });
  }
  prisma = (global as any).prisma;
}

export { prisma };
