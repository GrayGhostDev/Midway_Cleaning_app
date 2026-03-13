// Database types — replaces @prisma/client imports.
// These match the Prisma schema and will be used until Supabase
// generated types (`supabase gen types typescript`) are in place.

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CLEANER = 'CLEANER',
  CLIENT = 'CLIENT',
}

export enum ServiceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// ── Model types ──────────────────────────────────────────────

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  password?: string | null;
  name?: string | null;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string | null;
  clerkId: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  status: BookingStatus;
  userId: string;
  serviceId: string;
  notes?: string | null;
  cleanerId?: string | null;
  // Relations (optional, populated by includes/joins)
  user?: User;
  service?: Service;
  cleaner?: User | null;
  payment?: Payment | null;
  feedback?: Feedback | null;
}

export interface Payment {
  id: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  status: PaymentStatus;
  bookingId: string;
  transactionId?: string | null;
  paymentMethod?: string | null;
}

export interface Document {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  url: string;
  type: string;
  size: number;
  userId: string;
  isPublic: boolean;
  sharedWith: string[];
}

export interface Review {
  id: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  comment?: string | null;
  userId: string;
  bookingId: string;
}

export interface Notification {
  id: string;
  createdAt: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  bookingId?: string | null;
}

export interface Shift {
  id: string;
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  userId: string;
  notes?: string | null;
  hourlyRate: number;
}

export interface Task {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  cleanerId?: string | null;
  bookingId?: string | null;
}

export interface Equipment {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string | null;
  serialNumber?: string | null;
  purchaseDate?: string | null;
  warrantyExpiry?: string | null;
  status: string;
  category: string;
  location?: string | null;
}

export interface MaintenanceLog {
  id: string;
  createdAt: string;
  updatedAt: string;
  performedAt: string;
  description: string;
  cost: number;
  type: string;
  status: string;
  equipmentId: string;
}

export interface Location {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  address?: string | null;
  type: string;
}

export interface InventoryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string | null;
  category: string;
  unit: string;
  minQuantity: number;
  currentQuantity: number;
  locationId?: string | null;
}

export interface InventoryTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  type: string;
  quantity: number;
  cost: number;
  itemId: string;
}

export interface Feedback {
  id: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  comment?: string | null;
  userId?: string | null;
  bookingId?: string | null;
}

export interface Report {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  type: string;
  status: string;
  data?: Record<string, unknown> | null;
  startDate: string;
  endDate: string;
  generatedBy?: string | null;
  format: string;
  url?: string | null;
  error?: string | null;
}

export interface Profile {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
}
