// Database error handling -- generic implementation (not Prisma-specific).
// These error types work with any database client (Supabase, raw SQL, etc.).

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
  if (error instanceof DatabaseError) {
    throw error;
  }

  // Handle PostgreSQL error codes (returned by Supabase/pg)
  const pgError = error as { code?: string; message?: string; detail?: string };

  if (pgError.code) {
    switch (pgError.code) {
      case '23505':
        throw new DatabaseError(
          'A unique constraint would be violated.',
          'UNIQUE_CONSTRAINT_VIOLATION',
          error
        );
      case '23503':
        throw new DatabaseError(
          'Foreign key constraint failed.',
          'FOREIGN_KEY_VIOLATION',
          error
        );
      case '23502':
        throw new DatabaseError(
          'A required field is missing.',
          'NOT_NULL_VIOLATION',
          error
        );
      case 'PGRST116':
        throw new DatabaseError(
          'Record not found.',
          'NOT_FOUND',
          error
        );
      default:
        throw new DatabaseError(
          pgError.message || 'An unexpected database error occurred.',
          'UNKNOWN_ERROR',
          error
        );
    }
  }

  throw new DatabaseError(
    'An unexpected error occurred.',
    'UNKNOWN_ERROR',
    error
  );
}

export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof DatabaseError && error.code === 'UNIQUE_CONSTRAINT_VIOLATION'
  );
}

export function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof DatabaseError && error.code === 'NOT_FOUND'
  );
}

export function isForeignKeyError(error: unknown): boolean {
  return (
    error instanceof DatabaseError && error.code === 'FOREIGN_KEY_VIOLATION'
  );
}
