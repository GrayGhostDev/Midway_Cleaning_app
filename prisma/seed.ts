import { PrismaClient, UserRole, ServiceStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create sample admin user with address
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@midwaycleaning.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      isActive: true,
      phoneNumber: '555-0100',
      address: {
        create: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        }
      }
    }
  });

  // Create sample employees
  const employee1 = await prisma.user.create({
    data: {
      email: 'john.doe@midwaycleaning.com',
      name: 'John Doe',
      role: UserRole.CLEANER,
      isActive: true,
      phoneNumber: '555-0101',
      address: {
        create: {
          street: '456 Oak St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94106',
          country: 'USA'
        }
      }
    }
  });

  const employee2 = await prisma.user.create({
    data: {
      email: 'jane.smith@midwaycleaning.com',
      name: 'Jane Smith',
      role: UserRole.CLEANER,
      isActive: true,
      phoneNumber: '555-0102',
      address: {
        create: {
          street: '789 Pine St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          country: 'USA'
        }
      }
    }
  });

  // Create sample service
  const service = await prisma.service.create({
    data: {
      name: 'Standard Cleaning',
      description: 'Complete house cleaning service',
      price: 150.00,
      duration: 180, // 3 hours in minutes
      isActive: true
    }
  });

  // Create sample booking
  const booking = await prisma.booking.create({
    data: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      status: ServiceStatus.PENDING,
      userId: adminUser.id,
      serviceId: service.id,
      cleanerId: employee1.id,
      notes: 'Please bring eco-friendly cleaning supplies'
    }
  });

  // Create sample shifts
  const shift1 = await prisma.shift.create({
    data: {
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // Tomorrow + 8 hours
      duration: 480, // 8 hours in minutes
      status: 'SCHEDULED',
      userId: employee1.id,
      hourlyRate: 25.00,
      notes: 'Morning shift'
    }
  });

  const shift2 = await prisma.shift.create({
    data: {
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // Tomorrow + 8 hours
      duration: 480, // 8 hours in minutes
      status: 'SCHEDULED',
      userId: employee2.id,
      hourlyRate: 25.00,
      notes: 'Afternoon shift'
    }
  });

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Deep Clean Kitchen',
      description: 'Complete deep cleaning of kitchen including appliances',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      cleanerId: employee1.id
    }
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Bathroom Sanitization',
      description: 'Sanitize and deep clean all bathrooms',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      cleanerId: employee2.id
    }
  });

  // Create sample payment
  const payment = await prisma.payment.create({
    data: {
      amount: 150.00,
      status: PaymentStatus.PENDING,
      bookingId: booking.id,
      transactionId: 'txn_123456',
      paymentMethod: 'credit_card'
    }
  });

  console.log({
    adminUser,
    employees: [employee1, employee2],
    service,
    booking,
    shifts: [shift1, shift2],
    tasks: [task1, task2],
    payment
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
