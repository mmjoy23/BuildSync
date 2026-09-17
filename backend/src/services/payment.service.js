import prisma from '../config/prisma.js';
import { Prisma } from '@prisma/client';
import { NotificationService } from './notification.service.js';

/**
 * Generates a unique receipt number: BS-YYYY-NNNNNN.
 * Derived from the highest existing receipt sequence for the year, not from payment count,
 * so it is collision-safe even when non-sequential receipts exist in the database.
 */
async function generateReceiptNumber(tx) {
  const year = new Date().getFullYear();
  const prefix = `BS-${year}-`;

  // Find the highest existing sequence number for this year
  const last = await tx.payment.findFirst({
    where: { receiptNumber: { startsWith: prefix } },
    orderBy: { receiptNumber: 'desc' },
    select: { receiptNumber: true },
  });

  let seq = 1;
  if (last?.receiptNumber) {
    const suffix = last.receiptNumber.slice(prefix.length);
    const parsed = parseInt(suffix, 10);
    if (!isNaN(parsed)) {
      seq = parsed + 1;
    }
  }

  // Loop until we find an unused candidate (guards against concurrent inserts)
  let candidate = `${prefix}${String(seq).padStart(6, '0')}`;
  let exists = await tx.payment.findUnique({ where: { receiptNumber: candidate } });
  while (exists) {
    seq++;
    candidate = `${prefix}${String(seq).padStart(6, '0')}`;
    exists = await tx.payment.findUnique({ where: { receiptNumber: candidate } });
  }
  return candidate;
}

/** Standard include object for payment queries. */
function buildPaymentInclude() {
  return {
    bill: {
      select: {
        id: true,
        billingMonth: true,
        dueDate: true,
        totalAmount: true,
        status: true,
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
    },
    tenant: {
      select: { id: true, name: true, email: true, phone: true },
    },
  };
}

export class PaymentService {
  // ============================================================
  // CREATE PAYMENT  (POST /api/payments)
  // ============================================================
  static async createPayment(data, user) {
    // Only TENANT and ADMIN can create payments.
    if (user.role === 'OWNER') {
      const err = new Error('Forbidden. Owners cannot record payments on behalf of tenants.');
      err.statusCode = 403;
      throw err;
    }

    // Load target bill with full lease/property chain.
    const bill = await prisma.bill.findUnique({
      where: { id: data.billId },
      include: {
        lease: {
          include: { unit: { include: { property: true } } },
        },
      },
    });

    if (!bill) {
      const err = new Error('Bill not found.');
      err.statusCode = 404;
      throw err;
    }

    // TENANT: must only pay their own bill.
    if (user.role === 'TENANT' && bill.lease.tenantId !== user.id) {
      const err = new Error('Forbidden. You can only make payments for your own bills.');
      err.statusCode = 403;
      throw err;
    }

    // Reject payments on fully PAID bills.
    if (bill.status === 'PAID') {
      const err = new Error('This bill is already fully paid.');
      err.statusCode = 409;
      throw err;
    }

    // Overpayment prevention: bill total - (verified + pending) = max new payment
    const billTotal = new Prisma.Decimal(bill.totalAmount);
    const paymentAmount = new Prisma.Decimal(data.amount);

    const existingAgg = await prisma.payment.aggregate({
      where: { billId: data.billId, status: { in: ['VERIFIED', 'PENDING'] } },
      _sum: { amount: true },
    });

    const committedSum = existingAgg._sum.amount
      ? new Prisma.Decimal(existingAgg._sum.amount)
      : new Prisma.Decimal(0);

    const remaining = billTotal.sub(committedSum);

    if (paymentAmount.greaterThan(remaining)) {
      const err = new Error(
        `Payment amount ${paymentAmount} exceeds the remaining payable balance of ${remaining}. ` +
          `Bill total: ${billTotal}, already committed (VERIFIED + PENDING): ${committedSum}.`
      );
      err.statusCode = 422;
      throw err;
    }

    // Derive tenantId from bill lease — never trust the client.
    const derivedTenantId = bill.lease.tenantId;

    // Create payment record (status: PENDING, receiptNumber: null).
    try {
      const payment = await prisma.payment.create({
        data: {
          billId: data.billId,
          tenantId: derivedTenantId,
          amount: paymentAmount,
          method: data.method,
          transactionId: data.transactionId || null,
          receiptNumber: null,
          status: 'PENDING',
        },
        include: buildPaymentInclude(),
      });

      // Notify the property owner that a tenant has submitted a payment
      const ownerId = bill.lease.unit.property.ownerId;
      if (ownerId) {
        await NotificationService.createNotification({
          userId: ownerId,
          type: 'PAYMENT_SUBMITTED',
          title: 'New Payment Submitted',
          message: `Tenant has submitted a payment of ৳${paymentAmount} via ${data.method} for ${bill.billingMonth}.`,
        });
      }

      return payment;
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('transaction_id')) {
        const err = new Error('A payment with this transactionId already exists.');
        err.statusCode = 409;
        throw err;
      }
      throw e;
    }
  }

  // ============================================================
  // GET PAYMENTS  (GET /api/payments)
  // ============================================================
  static async getPayments(user, query = {}) {
    let where = {};

    if (user.role === 'ADMIN') {
      where = {
        ...(query.billId && { billId: query.billId }),
        ...(query.tenantId && { tenantId: query.tenantId }),
        ...(query.status && { status: query.status }),
        ...(query.method && { method: query.method }),
        ...(query.propertyId && {
          bill: { lease: { unit: { propertyId: query.propertyId } } },
        }),
      };
    } else if (user.role === 'OWNER') {
      where = {
        bill: {
          lease: {
            unit: {
              property: { ownerId: user.id },
              ...(query.propertyId && { propertyId: query.propertyId }),
            },
          },
        },
        ...(query.billId && { billId: query.billId }),
        ...(query.status && { status: query.status }),
        ...(query.method && { method: query.method }),
      };
    } else if (user.role === 'TENANT') {
      where = {
        tenantId: user.id,
        ...(query.billId && { billId: query.billId }),
        ...(query.status && { status: query.status }),
        ...(query.method && { method: query.method }),
      };
    }

    return prisma.payment.findMany({
      where,
      include: buildPaymentInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================================
  // GET PAYMENT BY ID  (GET /api/payments/:id)
  // ============================================================
  static async getPaymentById(paymentId, user) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: buildPaymentInclude(),
    });

    if (!payment) {
      const err = new Error('Payment not found.');
      err.statusCode = 404;
      throw err;
    }

    if (user.role === 'TENANT' && payment.tenantId !== user.id) {
      const err = new Error('Forbidden. You can only view your own payments.');
      err.statusCode = 403;
      throw err;
    }

    if (user.role === 'OWNER' && payment.bill.lease.unit.property.ownerId !== user.id) {
      const err = new Error('Forbidden. This payment is not associated with your property.');
      err.statusCode = 403;
      throw err;
    }

    return payment;
  }

  // ============================================================
  // VERIFY PAYMENT  (PATCH /api/payments/:id/verify)
  // ============================================================
  static async verifyPayment(paymentId, user) {
    if (user.role === 'TENANT') {
      const err = new Error('Forbidden. Tenants cannot verify payments.');
      err.statusCode = 403;
      throw err;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Re-fetch inside transaction for freshness.
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: {
          bill: {
            include: {
              lease: { include: { unit: { include: { property: true } } } },
            },
          },
        },
      });

      if (!payment) {
        const err = new Error('Payment not found.');
        err.statusCode = 404;
        throw err;
      }

      if (user.role === 'OWNER' && payment.bill.lease.unit.property.ownerId !== user.id) {
        const err = new Error('Forbidden. This payment is not associated with your property.');
        err.statusCode = 403;
        throw err;
      }

      if (payment.status === 'VERIFIED') {
        const err = new Error('This payment has already been verified.');
        err.statusCode = 409;
        throw err;
      }

      if (payment.status === 'FAILED') {
        const err = new Error('Cannot verify a failed payment.');
        err.statusCode = 409;
        throw err;
      }

      // Re-check overpayment inside transaction using Prisma.Decimal.
      const bill = payment.bill;
      const billTotal = new Prisma.Decimal(bill.totalAmount);
      const paymentAmount = new Prisma.Decimal(payment.amount);

      const verifiedAgg = await tx.payment.aggregate({
        where: { billId: bill.id, status: 'VERIFIED', id: { not: paymentId } },
        _sum: { amount: true },
      });

      const alreadyVerified = verifiedAgg._sum.amount
        ? new Prisma.Decimal(verifiedAgg._sum.amount)
        : new Prisma.Decimal(0);

      const projectedVerified = alreadyVerified.add(paymentAmount);

      if (projectedVerified.greaterThan(billTotal)) {
        const err = new Error(
          `Verification would cause total verified payments (${projectedVerified}) ` +
            `to exceed the bill total (${billTotal}).`
        );
        err.statusCode = 422;
        throw err;
      }

      const receiptNumber = await generateReceiptNumber(tx);

      const verifiedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'VERIFIED', receiptNumber, paymentDate: new Date() },
        include: buildPaymentInclude(),
      });

      // Update bill status.
      const newBillStatus = projectedVerified.equals(billTotal) ? 'PAID' : 'PENDING';

      await tx.bill.update({
        where: { id: bill.id },
        data: { status: newBillStatus },
      });

      // 1. Notify tenant: Payment Verified
      await NotificationService.createNotification(
        {
          userId: payment.tenantId,
          type: 'PAYMENT_VERIFIED',
          title: 'Payment Verified',
          message: `Your payment of ৳${paymentAmount} for ${bill.billingMonth} has been verified successfully. Receipt: ${receiptNumber}.`,
        },
        tx
      );

      // 2. If bill transitioned to PAID, notify tenant: Bill Paid
      if (newBillStatus === 'PAID' && bill.status !== 'PAID') {
        await NotificationService.createNotification(
          {
            userId: payment.tenantId,
            type: 'BILL_PAID',
            title: 'Bill Paid',
            message: `Your bill for ${bill.billingMonth} (Total: ৳${billTotal}) has been fully paid.`,
          },
          tx
        );
      }

      return { payment: verifiedPayment, billStatus: newBillStatus };
    });

    return result;
  }

  // ============================================================
  // GET RECEIPT  (GET /api/payments/:id/receipt)
  // ============================================================
  static async getReceipt(paymentId, user) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        bill: {
          include: {
            items: true,
            lease: {
              include: {
                tenant: { select: { id: true, name: true, email: true, phone: true } },
                unit: {
                  include: {
                    property: { select: { id: true, name: true, address: true, ownerId: true } },
                  },
                },
              },
            },
          },
        },
        tenant: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!payment) {
      const err = new Error('Payment not found.');
      err.statusCode = 404;
      throw err;
    }

    if (user.role === 'TENANT' && payment.tenantId !== user.id) {
      const err = new Error('Forbidden. You can only view receipts for your own payments.');
      err.statusCode = 403;
      throw err;
    }

    if (user.role === 'OWNER' && payment.bill.lease.unit.property.ownerId !== user.id) {
      const err = new Error('Forbidden. This payment is not associated with your property.');
      err.statusCode = 403;
      throw err;
    }

    const bill = payment.bill;
    const billTotal = new Prisma.Decimal(bill.totalAmount);

    const verifiedAgg = await prisma.payment.aggregate({
      where: { billId: bill.id, status: 'VERIFIED' },
      _sum: { amount: true },
    });

    const totalVerified = verifiedAgg._sum.amount
      ? new Prisma.Decimal(verifiedAgg._sum.amount)
      : new Prisma.Decimal(0);

    const remainingBalance = billTotal.sub(totalVerified);

    return {
      receipt: {
        receiptNumber: payment.receiptNumber,
        paymentId: payment.id,
        paymentStatus: payment.status,
        paymentDate: payment.paymentDate,
        amount: payment.amount,
        method: payment.method,
        transactionId: payment.transactionId || null,
      },
      bill: {
        billId: bill.id,
        billingMonth: bill.billingMonth,
        dueDate: bill.dueDate,
        totalAmount: bill.totalAmount,
        billStatus: bill.status,
        remainingBalance,
      },
      tenant: {
        id: payment.tenant.id,
        name: payment.tenant.name,
        email: payment.tenant.email,
        phone: payment.tenant.phone || null,
      },
      property: {
        id: bill.lease.unit.property.id,
        name: bill.lease.unit.property.name,
        address: bill.lease.unit.property.address,
      },
      unit: {
        id: bill.lease.unit.id,
        unitNumber: bill.lease.unit.unitNumber,
        floorNumber: bill.lease.unit.floorNumber,
      },
    };
  }
}
