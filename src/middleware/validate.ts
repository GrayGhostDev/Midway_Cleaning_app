import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

interface ValidationConfig {
  body?: z.ZodType<any>;
  query?: z.ZodType<any>;
  params?: z.ZodType<any>;
}

export function validate(config: ValidationConfig) {
  return async (req: NextRequest) => {
    try {
      // Validate query parameters
      if (config.query) {
        const queryParams = Object.fromEntries(req.nextUrl.searchParams);
        await config.query.parseAsync(queryParams);
      }

      // Validate request body for POST/PUT/PATCH requests
      if (config.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const body = await req.json();
        await config.body.parseAsync(body);
      }

      // Validate URL parameters
      if (config.params) {
        const params = req.nextUrl.pathname
          .split('/')
          .filter(Boolean)
          .reduce((acc, curr, i) => ({
            ...acc,
            [i]: curr,
          }), {});
        await config.params.parseAsync(params);
      }

      return NextResponse.next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({
            error: 'Validation Error',
            details: fromZodError(error).message,
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      return new NextResponse(
        JSON.stringify({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  };
}

// Common validation schemas
export const schemas = {
  id: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  date: z.string().datetime(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  address: z.string().min(5).max(200),
  price: z.number().positive(),
  limit: z.number().int().positive().max(100),
  page: z.number().int().positive(),
  sort: z.enum(['asc', 'desc']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
};

// Example validation schemas for different endpoints
export const bookingValidation = {
  create: validate({
    body: z.object({
      serviceId: schemas.id,
      date: schemas.date,
      time: schemas.time,
      address: schemas.address,
      specialInstructions: z.string().max(500).optional(),
    }),
  }),
  list: validate({
    query: z.object({
      status: schemas.status.optional(),
      page: schemas.page.optional(),
      limit: schemas.limit.optional(),
      sort: schemas.sort.optional(),
    }),
  }),
  update: validate({
    params: z.object({
      id: schemas.id,
    }),
    body: z.object({
      status: schemas.status,
      notes: z.string().max(500).optional(),
    }),
  }),
};

export const paymentValidation = {
  create: validate({
    body: z.object({
      bookingId: schemas.id,
      amount: schemas.price,
      currency: z.enum(['USD']),
      paymentMethod: z.enum(['card', 'bank_transfer']),
      metadata: z.record(z.string()).optional(),
    }),
  }),
};

export const fileValidation = {
  upload: validate({
    body: z.object({
      filename: z.string().max(255),
      contentType: z.enum([
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
      ]),
      size: z.number().max(10 * 1024 * 1024), // 10MB max
    }),
  }),
};
