import { NextResponse } from 'next/server';
import { z } from 'zod';

export type ValidationSchema = z.ZodType<any, any>;

export function withValidation<T extends ValidationSchema>(
  schema: T,
  handler: (req: Request, validatedData: z.infer<T>) => Promise<Response>
) {
  return async (req: Request) => {
    try {
      const body = await req.json();
      const validatedData = await schema.parseAsync(body);
      return handler(req, validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(JSON.stringify({
          error: 'Validation failed',
          details: error.errors,
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new NextResponse(JSON.stringify({
        error: 'Invalid request',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

// Common validation schemas
export const schemas = {
  booking: z.object({
    serviceId: z.string().min(1),
    date: z.string().datetime(),
    notes: z.string().optional(),
  }),

  service: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    duration: z.number().int().positive(),
  }),

  review: z.object({
    bookingId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),

  document: z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    size: z.number().int().positive(),
    isPublic: z.boolean().optional(),
    sharedWith: z.array(z.string()).optional(),
  }),

  payment: z.object({
    bookingId: z.string().min(1),
    amount: z.number().positive(),
    paymentMethod: z.string().min(1),
  }),
};

// Example usage:
// export const POST = withValidation(schemas.booking, async (req, data) => {
//   // data is typed and validated
//   const { serviceId, date, notes } = data;
//   // ... handle request
// });
