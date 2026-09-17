import prisma from '../config/prisma.js';
import { Prisma } from '@prisma/client';
import { NotificationService } from './notification.service.js';

export class BillService {
  /**
   * Create a new Bill with line items inside a database transaction.
   * Calculates totalAmount authoritatively on the backend from actual items.
   */
  static async createBill(data, user) {
    // 1. Find target Lease and verify existence
    const lease = await prisma.lease.findUnique({
      where: { id: data.leaseId },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!lease) {
      const error = new Error('Lease not found');
      error.statusCode = 404;
      throw error;
    }

    // 2. Role-based scoping check
    if (user.role === 'OWNER' && lease.unit.property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not own the property for this lease.');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'TENANT') {
      const error = new Error('Forbidden. Tenants cannot create bills.');
      error.statusCode = 403;
      throw error;
    }

    // 3. Check for unique constraint (leaseId + billingMonth)
    const existingBill = await prisma.bill.findUnique({
      where: {
        leaseId_billingMonth: {
          leaseId: data.leaseId,
          billingMonth: data.billingMonth,
        },
      },
    });

    if (existingBill) {
      const error = new Error(
        `A bill for lease ${data.leaseId} and billing month ${data.billingMonth} already exists.`
      );
      error.statusCode = 409;
      throw error;
    }

    // 4. Calculate totalAmount using Prisma.Decimal to prevent floating-point inaccuracies
    const calculatedTotal = data.items.reduce((acc, item) => {
      const itemAmount = new Prisma.Decimal(item.amount);
      return acc.add(itemAmount);
    }, new Prisma.Decimal(0));

    // 5. Database transaction: Create Bill, BillItems, and notify Tenant atomically
    const newBill = await prisma.$transaction(async (tx) => {
      const bill = await tx.bill.create({
        data: {
          leaseId: data.leaseId,
          billingMonth: data.billingMonth,
          dueDate: data.dueDate,
          totalAmount: calculatedTotal,
          status: 'PENDING',
          items: {
            create: data.items.map((item) => ({
              itemType: item.type,
              description: item.description || null,
              amount: new Prisma.Decimal(item.amount),
            })),
          },
        },
        include: {
          items: true,
          lease: {
            include: {
              tenant: {
                select: { id: true, name: true, email: true, phone: true },
              },
              unit: {
                include: {
                  property: {
                    select: { id: true, name: true, address: true, ownerId: true },
                  },
                },
              },
            },
          },
        },
      });

      // Notify the tenant about the new bill
      await NotificationService.createNotification(
        {
          userId: lease.tenantId,
          type: 'BILL_CREATED',
          title: 'New Bill Available',
          message: `A new bill of ৳${calculatedTotal} for ${data.billingMonth} has been generated for your lease.`,
        },
        tx
      );

      return bill;
    });

    return newBill;
  }

  /**
   * Retrieve bills scoped by authenticated user role.
   */
  static async getBills(user, query = {}) {
    let where = {};

    if (user.role === 'ADMIN') {
      where = {
        ...(query.leaseId && { leaseId: query.leaseId }),
        ...(query.status && { status: query.status }),
        ...(query.billingMonth && { billingMonth: query.billingMonth }),
        ...(query.propertyId && {
          lease: { unit: { propertyId: query.propertyId } },
        }),
      };
    } else if (user.role === 'OWNER') {
      where = {
        lease: {
          unit: {
            property: {
              ownerId: user.id,
            },
            ...(query.propertyId && { propertyId: query.propertyId }),
          },
        },
        ...(query.leaseId && { leaseId: query.leaseId }),
        ...(query.status && { status: query.status }),
        ...(query.billingMonth && { billingMonth: query.billingMonth }),
      };
    } else if (user.role === 'TENANT') {
      where = {
        lease: {
          tenantId: user.id,
        },
        ...(query.leaseId && { leaseId: query.leaseId }),
        ...(query.status && { status: query.status }),
        ...(query.billingMonth && { billingMonth: query.billingMonth }),
      };
    }

    const bills = await prisma.bill.findMany({
      where,
      include: {
        items: true,
        lease: {
          include: {
            tenant: {
              select: { id: true, name: true, email: true, phone: true },
            },
            unit: {
              include: {
                property: {
                  select: { id: true, name: true, address: true, ownerId: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bills;
  }

  /**
   * Retrieve a specific bill by ID with authorization checks.
   */
  static async getBillById(billId, user) {
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        items: true,
        lease: {
          include: {
            tenant: {
              select: { id: true, name: true, email: true, phone: true },
            },
            unit: {
              include: {
                property: {
                  select: { id: true, name: true, address: true, ownerId: true },
                },
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            method: true,
            receiptNumber: true,
            status: true,
            paymentDate: true,
          },
        },
      },
    });

    if (!bill) {
      const error = new Error('Bill not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'TENANT' && bill.lease.tenantId !== user.id) {
      const error = new Error('Forbidden. You do not have access to view this bill.');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'OWNER' && bill.lease.unit.property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not own the property associated with this bill.');
      error.statusCode = 403;
      throw error;
    }

    return bill;
  }

  /**
   * Get bills for the authenticated tenant.
   */
  static async getTenantBills(tenantId, query = {}) {
    const where = {
      lease: {
        tenantId,
      },
      ...(query.status && { status: query.status }),
      ...(query.billingMonth && { billingMonth: query.billingMonth }),
    };

    const bills = await prisma.bill.findMany({
      where,
      include: {
        items: true,
        lease: {
          include: {
            unit: {
              include: {
                property: {
                  select: { id: true, name: true, address: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bills;
  }
}
