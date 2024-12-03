import { Prisma } from '@prisma/client';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function handleDatabaseError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      case 'P2002':
        throw new DatabaseError(
          'A unique constraint would be violated.',
          'UNIQUE_CONSTRAINT_VIOLATION',
          error
        );
      case 'P2014':
        throw new DatabaseError(
          'The change you are trying to make would violate the required relation.',
          'RELATION_VIOLATION',
          error
        );
      case 'P2003':
        throw new DatabaseError(
          'Foreign key constraint failed.',
          'FOREIGN_KEY_VIOLATION',
          error
        );
      case 'P2025':
        throw new DatabaseError(
          'Record not found.',
          'NOT_FOUND',
          error
        );
      default:
        throw new DatabaseError(
          'An unexpected database error occurred.',
          'UNKNOWN_ERROR',
          error
        );
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseError(
      'Invalid data provided.',
      'VALIDATION_ERROR',
      error
    );
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new DatabaseError(
      'Failed to initialize database connection.',
      'INITIALIZATION_ERROR',
      error
    );
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw new DatabaseError(
      'A critical database error occurred.',
      'CRITICAL_ERROR',
      error
    );
  } else {
    throw new DatabaseError(
      'An unexpected error occurred.',
      'UNKNOWN_ERROR',
      error
    );
  }
}

export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
  );
}

export function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
  );
}

export function isForeignKeyError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
  );
}
