import { PrismaClient, Role, UserStatus, UnitStatus, LeaseStatus, BillStatus, BillItemType, PaymentMethod, PaymentStatus, Priority, MaintenanceStatus, NoticeCategory, NoticeAudience, NoticeStatus, UtilityType, SupportTicketStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database foundation...');

  // 1. System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'PLATFORM_NAME' },
    update: {},
    create: {
      key: 'PLATFORM_NAME',
      value: 'BuildSync Property Management',
      description: 'Platform branding name',
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'CURRENCY' },
    update: {},
    create: {
      key: 'CURRENCY',
      value: 'BDT',
      description: 'Default platform currency',
    },
  });

  // Password hashes
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const ownerPassword = await bcrypt.hash('Owner123!', 10);
  const tenantPassword = await bcrypt.hash('Tenant123!', 10);

  // 2. Users (1 Admin, 2 Owners, 5 Tenants)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@buildsync.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@buildsync.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phone: '+880 1700-000000',
      status: UserStatus.ACTIVE,
    },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner@buildsync.com' },
    update: {},
    create: {
      name: 'Rahman Ahmed',
      email: 'owner@buildsync.com',
      passwordHash: ownerPassword,
      role: Role.OWNER,
      phone: '+880 1711-234567',
      status: UserStatus.ACTIVE,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@buildsync.com' },
    update: {},
    create: {
      name: 'Faruq Chowdhury',
      email: 'owner2@buildsync.com',
      passwordHash: ownerPassword,
      role: Role.OWNER,
      phone: '+880 1819-876543',
      status: UserStatus.ACTIVE,
    },
  });

  const tenant1 = await prisma.user.upsert({
    where: { email: 'tenant@buildsync.com' },
    update: {},
    create: {
      name: 'Tanjim Ahmed',
      email: 'tenant@buildsync.com',
      passwordHash: tenantPassword,
      role: Role.TENANT,
      phone: '+880 1912-345678',
      status: UserStatus.ACTIVE,
    },
  });

  const tenant2 = await prisma.user.upsert({
    where: { email: 'rahim@buildsync.com' },
    update: {},
    create: {
      name: 'Rahim Ahmed',
      email: 'rahim@buildsync.com',
      passwordHash: tenantPassword,
      role: Role.TENANT,
      phone: '+880 1711-123456',
      status: UserStatus.ACTIVE,
    },
  });

  const tenant3 = await prisma.user.upsert({
    where: { email: 'karim@buildsync.com' },
    update: {},
    create: {
      name: 'Karim Uddin',
      email: 'karim@buildsync.com',
      passwordHash: tenantPassword,
      role: Role.TENANT,
      phone: '+880 1822-234567',
      status: UserStatus.ACTIVE,
    },
  });

  const tenant4 = await prisma.user.upsert({
    where: { email: 'shakil@buildsync.com' },
    update: {},
    create: {
      name: 'Shakil Hasan',
      email: 'shakil@buildsync.com',
      passwordHash: tenantPassword,
      role: Role.TENANT,
      phone: '+880 1633-345678',
      status: UserStatus.ACTIVE,
    },
  });

  const tenant5 = await prisma.user.upsert({
    where: { email: 'farhana@buildsync.com' },
    update: {},
    create: {
      name: 'Farhana Kabir',
      email: 'farhana@buildsync.com',
      passwordHash: tenantPassword,
      role: Role.TENANT,
      phone: '+880 1544-456789',
      status: UserStatus.ACTIVE,
    },
  });

  // 3. Properties (3 Properties)
  const prop1 = await prisma.property.create({
    data: {
      ownerId: owner1.id,
      name: 'ABC Residence',
      address: 'Road 11, Banani, Dhaka',
      yearBuilt: 2021,
      propertyType: 'Residential',
      status: 'Active',
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      ownerId: owner1.id,
      name: 'Green View Apartments',
      address: 'Sector 4, Uttara, Dhaka',
      yearBuilt: 2019,
      propertyType: 'Residential',
      status: 'Active',
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      ownerId: owner2.id,
      name: 'Lake City Heights',
      address: 'Gulshan 2, Dhaka',
      yearBuilt: 2023,
      propertyType: 'Luxury Residential',
      status: 'Active',
    },
  });

  // 4. Units for Property 1
  const unit3A = await prisma.unit.create({
    data: {
      propertyId: prop1.id,
      unitNumber: '3A',
      floorNumber: '3',
      bedrooms: 3,
      bathrooms: 2,
      areaSqft: 1420,
      status: UnitStatus.OCCUPIED,
      baseRent: 25000.00,
    },
  });

  const unit5B = await prisma.unit.create({
    data: {
      propertyId: prop1.id,
      unitNumber: '5B',
      floorNumber: '5',
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 1650,
      status: UnitStatus.OCCUPIED,
      baseRent: 25000.00,
    },
  });

  const unit2A = await prisma.unit.create({
    data: {
      propertyId: prop1.id,
      unitNumber: '2A',
      floorNumber: '2',
      bedrooms: 2,
      bathrooms: 2,
      areaSqft: 1200,
      status: UnitStatus.OCCUPIED,
      baseRent: 23000.00,
    },
  });

  const unit8A = await prisma.unit.create({
    data: {
      propertyId: prop1.id,
      unitNumber: '8A',
      floorNumber: '8',
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 1550,
      status: UnitStatus.VACANT,
      baseRent: 25000.00,
    },
  });

  // 5. Active Leases
  const lease1 = await prisma.lease.create({
    data: {
      unitId: unit3A.id,
      tenantId: tenant1.id,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      agreedRent: 25000.00,
      status: LeaseStatus.ACTIVE,
    },
  });

  const lease2 = await prisma.lease.create({
    data: {
      unitId: unit5B.id,
      tenantId: tenant2.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      agreedRent: 25000.00,
      status: LeaseStatus.ACTIVE,
    },
  });

  // 6. Parking Slot
  await prisma.parkingSlot.create({
    data: {
      propertyId: prop1.id,
      slotLabel: 'P-05',
      currentLeaseId: lease1.id,
      vehicleInfo: 'Honda Civic · Dhaka Metro-Ka 98-7654',
    },
  });

  // 7. Bills with Granular BillItems
  // Bill 1: September 2025 (Unpaid, Total = ৳33,580)
  const billSept = await prisma.bill.create({
    data: {
      leaseId: lease1.id,
      billingMonth: '2025-09',
      dueDate: new Date('2025-09-10'),
      totalAmount: 33580.00,
      status: BillStatus.PENDING,
      items: {
        create: [
          { itemType: BillItemType.RENT, amount: 25000.00, description: 'Monthly Apartment Rent' },
          { itemType: BillItemType.ELECTRICITY, amount: 3200.00, description: 'DESCO electricity sub-meter' },
          { itemType: BillItemType.WATER, amount: 800.00, description: 'WASA water supply' },
          { itemType: BillItemType.GAS, amount: 1080.00, description: 'Titas Gas monthly flat rate' },
          { itemType: BillItemType.SERVICE_CHARGE, amount: 2000.00, description: 'Building security and lift maintenance' },
          { itemType: BillItemType.PARKING, amount: 1500.00, description: 'Slot P-05 monthly fee' },
        ],
      },
    },
  });

  // Bill 2: August 2025 (Paid, Total = ৳28,500)
  const billAug = await prisma.bill.create({
    data: {
      leaseId: lease1.id,
      billingMonth: '2025-08',
      dueDate: new Date('2025-08-10'),
      totalAmount: 28500.00,
      status: BillStatus.PAID,
      items: {
        create: [
          { itemType: BillItemType.RENT, amount: 25000.00, description: 'Monthly Apartment Rent' },
          { itemType: BillItemType.ELECTRICITY, amount: 2200.00, description: 'DESCO electricity sub-meter' },
          { itemType: BillItemType.WATER, amount: 800.00, description: 'WASA water supply' },
          { itemType: BillItemType.GAS, amount: 500.00, description: 'Titas Gas consumption' },
        ],
      },
    },
  });

  // 8. Payments
  await prisma.payment.create({
    data: {
      billId: billAug.id,
      tenantId: tenant1.id,
      amount: 28500.00,
      method: PaymentMethod.NAGAD,
      transactionId: 'TXN-84110',
      receiptNumber: 'RCP-2025-84110',
      status: PaymentStatus.VERIFIED,
      paymentDate: new Date('2025-08-05'),
    },
  });

  await prisma.payment.create({
    data: {
      billId: billSept.id,
      tenantId: tenant1.id,
      amount: 33580.00,
      method: PaymentMethod.BKASH,
      transactionId: 'TXN-84921',
      status: PaymentStatus.PENDING,
      paymentDate: new Date('2025-09-05'),
    },
  });

  // 9. Utility Reading
  await prisma.utilityReading.create({
    data: {
      unitId: unit3A.id,
      utilityType: UtilityType.ELECTRICITY,
      readingDate: new Date('2025-08-31'),
      previousReading: 1240.00,
      currentReading: 1560.00,
      costPerUnit: 10.00,
      totalCost: 3200.00,
    },
  });

  // 10. Maintenance Request
  await prisma.maintenanceRequest.create({
    data: {
      tenantId: tenant1.id,
      unitId: unit3A.id,
      issueTitle: 'Lift not working properly',
      description: 'The lift has stopped between floors and is making a loud sound.',
      priority: Priority.MEDIUM,
      status: MaintenanceStatus.IN_PROGRESS,
      assignedTo: 'Technician (Otis Lift)',
      repairCost: 8000.00,
    },
  });

  // 11. Notices
  await prisma.notice.create({
    data: {
      authorId: owner1.id,
      propertyId: prop1.id,
      title: 'Water Supply Maintenance',
      category: NoticeCategory.MAINTENANCE,
      audience: NoticeAudience.PROPERTY_SPECIFIC,
      details: 'The overhead water reservoir will be sanitized. Kindly store adequate domestic water beforehand.',
      status: NoticeStatus.PUBLISHED,
    },
  });

  // 12. Expense
  await prisma.expense.create({
    data: {
      propertyId: prop1.id,
      category: 'Maintenance',
      amount: 12000.00,
      expenseDate: new Date('2025-08-24'),
      description: 'Main water pump valve replacement',
    },
  });

  // 13. Conversation & Messages
  const conversation = await prisma.conversation.create({
    data: {
      unitId: unit3A.id,
      subject: 'September Billing & Tap Issue',
      participants: {
        create: [
          { userId: owner1.id },
          { userId: tenant1.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: owner1.id,
            content: 'Your September bill has been generated.',
          },
          {
            senderId: tenant1.id,
            content: 'Thank you. I will make the payment today.',
          },
        ],
      },
    },
  });

  // 14. Support Ticket
  await prisma.supportTicket.create({
    data: {
      userId: owner1.id,
      subject: 'Request for custom billing report export',
      description: 'Need quarterly export format customized for tax filing.',
      priority: Priority.LOW,
      status: SupportTicketStatus.OPEN,
    },
  });

  console.log('Database seeded successfully with all entities and verified relations!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
