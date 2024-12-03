import { z } from 'zod';
import { Role } from '@/lib/auth/rbac';

// Base schemas for common fields
const baseEntitySchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User validation schemas
export const userSchema = baseEntitySchema.extend({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE', 'CLIENT'] as const),
});

export const userUpdateSchema = userSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

// Task validation schemas
export const taskSchema = baseEntitySchema.extend({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assigneeId: z.string().cuid(),
  locationId: z.string().cuid(),
  dueDate: z.date(),
});

export const taskUpdateSchema = taskSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

// Location validation schemas
export const locationSchema = baseEntitySchema.extend({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().length(2),
  zipCode: z.string().length(5),
  contactName: z.string().min(1).max(100),
  contactPhone: z.string().min(10).max(15),
  contactEmail: z.string().email(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const locationUpdateSchema = locationSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

// Invoice validation schemas
export const invoiceSchema = baseEntitySchema.extend({
  number: z.string().min(1).max(50),
  clientId: z.string().cuid(),
  amount: z.number().positive(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']),
  dueDate: z.date(),
  items: z.array(
    z.object({
      description: z.string().min(1).max(200),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
      total: z.number().positive(),
    })
  ),
});

export const invoiceUpdateSchema = invoiceSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

// Inventory validation schemas
export const inventoryItemSchema = baseEntitySchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.string().min(1).max(50),
  quantity: z.number().min(0),
  unit: z.string().min(1).max(20),
  reorderPoint: z.number().min(0),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']),
});

export const inventoryItemUpdateSchema = inventoryItemSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

// Helper function to validate data
export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  return schema.parse(data);
}

// Helper function to validate partial data
export function validatePartialData<T extends z.ZodObject<any>>(
  schema: T,
  data: unknown
): z.infer<T> {
  return schema.partial().parse(data);
}

// Helper function to validate array of data
export function validateArrayData<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T>[] {
  return z.array(schema).parse(data);
}
