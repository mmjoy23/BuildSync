import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PaymentService } from '../src/services/payment.service.js';
import { BillService } from '../src/services/bill.service.js';
import { createPaymentSchema } from '../src/validators/payment.validators.js';
import { getTestContext } from './test-helpers.js';
import prisma from '../src/config/prisma.js';
import { Prisma } from '@prisma/client';

describe('PART 6: Payment, Partial Payment, Receipt & Concurrency Tests', () => {
  let ctx;
  let testBill = null;
  let payment1 = null;
  let payment2 = null;
  let payment3 = null;
  const billingMonth = '2027-04';

  it('0. Setup test bill (Total: 30,000)', async () => {
    ctx = await getTestContext();
    await prisma.payment.deleteMany({ where: { bill: { billingMonth } } });
    await prisma.billItem.deleteMany({ where: { bill: { billingMonth } } });
    await prisma.bill.deleteMany({ where: { billingMonth } });

    testBill = await BillService.createBill({
      leaseId: ctx.leases.lease1.id,
      billingMonth,
      dueDate: new Date('2027-04-10'),
      items: [
        { type: 'RENT', amount: 20000 },
        { type: 'SERVICE_CHARGE', amount: 10000 },
      ],
    }, ctx.users.owner1);

    assert.equal(testBill.totalAmount.toString(), '30000');
    assert.equal(testBill.status, 'PENDING');
  });

  it('1. Tenant can create payment for own bill & starts as PENDING', async () => {
    payment1 = await PaymentService.createPayment({
      billId: testBill.id,
      amount: 10000,
      method: 'BKASH',
      transactionId: 'TXN-P6-001',
    }, ctx.users.tenant1);

    assert.ok(payment1.id);
    assert.equal(payment1.status, 'PENDING');
    assert.equal(payment1.tenantId, ctx.users.tenant1.id, 'TenantId must be derived server-side');
    assert.equal(payment1.receiptNumber, null, 'Receipt number must be null while PENDING');
  });

  it('2. Tenant cannot create payment for another tenants bill', async () => {
    await assert.rejects(
      async () => {
        await PaymentService.createPayment({
          billId: testBill.id,
          amount: 5000,
          method: 'NAGAD',
          transactionId: 'TXN-P6-FORBIDDEN',
        }, ctx.users.tenant2);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Forbidden'));
        return true;
      }
    );
  });

  it('3. Owner cannot create payments on behalf of tenants', async () => {
    await assert.rejects(
      async () => {
        await PaymentService.createPayment({
          billId: testBill.id,
          amount: 5000,
          method: 'CASH',
        }, ctx.users.owner1);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Owners cannot record payments'));
        return true;
      }
    );
  });

  it('4. BKASH and NAGAD require transactionId in Zod validation', () => {
    assert.throws(
      () => {
        createPaymentSchema.parse({
          billId: testBill.id,
          amount: 5000,
          method: 'BKASH',
        });
      },
      (err) => {
        assert.ok(err.errors.some((e) => e.message.includes('transactionId is required for BKASH')));
        return true;
      }
    );
  });

  it('5. CASH allows optional transactionId in Zod validation', () => {
    const parsed = createPaymentSchema.parse({
      billId: testBill.id,
      amount: 5000,
      method: 'CASH',
    });
    assert.equal(parsed.method, 'CASH');
    assert.equal(parsed.transactionId, undefined);
  });

  it('6. Negative and zero payment amounts are rejected by Zod', () => {
    assert.throws(() => {
      createPaymentSchema.parse({ billId: testBill.id, amount: -100, method: 'CASH' });
    });
    assert.throws(() => {
      createPaymentSchema.parse({ billId: testBill.id, amount: 0, method: 'CASH' });
    });
  });

  it('7. Payment exceeding remaining balance is rejected (422)', async () => {
    // Bill total = 30000, already committed pending = 10000. Remaining = 20000.
    await assert.rejects(
      async () => {
        await PaymentService.createPayment({
          billId: testBill.id,
          amount: 25000,
          method: 'CASH',
        }, ctx.users.tenant1);
      },
      (err) => {
        assert.equal(err.statusCode, 422);
        assert.ok(err.message.includes('exceeds the remaining payable balance'));
        return true;
      }
    );
  });

  it('8. Tenant cannot verify payment (403)', async () => {
    await assert.rejects(
      async () => {
        await PaymentService.verifyPayment(payment1.id, ctx.users.tenant1);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Tenants cannot verify payments'));
        return true;
      }
    );
  });

  it('9. Unauthorized owner cannot verify payment (403)', async () => {
    await assert.rejects(
      async () => {
        await PaymentService.verifyPayment(payment1.id, ctx.users.owner2);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Forbidden'));
        return true;
      }
    );
  });

  it('10. Authorized owner verifies partial payment: bill remains PENDING, generates receipt', async () => {
    const res = await PaymentService.verifyPayment(payment1.id, ctx.users.owner1);
    assert.equal(res.payment.status, 'VERIFIED');
    assert.ok(res.payment.receiptNumber.startsWith('BS-'));
    assert.equal(res.billStatus, 'PENDING', 'Partial payment verification leaves bill PENDING');

    const updatedBill = await prisma.bill.findUnique({ where: { id: testBill.id } });
    assert.equal(updatedBill.status, 'PENDING');
  });

  it('11. Already verified payment cannot be verified again (409)', async () => {
    await assert.rejects(
      async () => {
        await PaymentService.verifyPayment(payment1.id, ctx.users.owner1);
      },
      (err) => {
        assert.equal(err.statusCode, 409);
        assert.ok(err.message.includes('already been verified'));
        return true;
      }
    );
  });

  it('12. Second partial payment created and verified', async () => {
    // Bill total 30000, 10000 verified, 20000 remaining
    payment2 = await PaymentService.createPayment({
      billId: testBill.id,
      amount: 10000,
      method: 'NAGAD',
      transactionId: 'TXN-P6-002',
    }, ctx.users.tenant1);

    const res2 = await PaymentService.verifyPayment(payment2.id, ctx.users.owner1);
    assert.equal(res2.payment.status, 'VERIFIED');
    assert.equal(res2.billStatus, 'PENDING');
    assert.notEqual(res2.payment.receiptNumber, payment1.receiptNumber, 'Receipt numbers must be unique');
  });

  it('13. Final payment causes bill status to become PAID', async () => {
    // Bill total 30000, 20000 verified, 10000 remaining
    payment3 = await PaymentService.createPayment({
      billId: testBill.id,
      amount: 10000,
      method: 'BANK_TRANSFER',
      transactionId: 'TXN-P6-003',
    }, ctx.users.tenant1);

    const res3 = await PaymentService.verifyPayment(payment3.id, ctx.users.owner1);
    assert.equal(res3.payment.status, 'VERIFIED');
    assert.equal(res3.billStatus, 'PAID', 'Exact total verification marks bill PAID');

    const updatedBill = await prisma.bill.findUnique({ where: { id: testBill.id } });
    assert.equal(updatedBill.status, 'PAID');
  });

  it('14. Payments on fully PAID bills are rejected (409)', async () => {
    await assert.rejects(
      async () => {
        await PaymentService.createPayment({
          billId: testBill.id,
          amount: 500,
          method: 'CASH',
        }, ctx.users.tenant1);
      },
      (err) => {
        assert.equal(err.statusCode, 409);
        assert.ok(err.message.includes('already fully paid'));
        return true;
      }
    );
  });

  it('15. Duplicate transactionId is rejected (409)', async () => {
    // Try to reuse TXN-P6-001 on another bill
    const otherBill = await BillService.createBill({
      leaseId: ctx.leases.lease2.id,
      billingMonth: '2027-05',
      dueDate: new Date('2027-05-10'),
      items: [{ type: 'RENT', amount: 15000 }],
    }, ctx.users.owner1);

    try {
      await assert.rejects(
        async () => {
          await PaymentService.createPayment({
            billId: otherBill.id,
            amount: 5000,
            method: 'BKASH',
            transactionId: 'TXN-P6-001',
          }, ctx.users.tenant2);
        },
        (err) => {
          assert.equal(err.statusCode, 409);
          assert.ok(err.message.includes('already exists'));
          return true;
        }
      );
    } finally {
      await prisma.billItem.deleteMany({ where: { billId: otherBill.id } });
      await prisma.bill.delete({ where: { id: otherBill.id } });
    }
  });

  it('16. Receipt endpoint returns complete and authorized receipt info', async () => {
    const receipt = await PaymentService.getReceipt(payment1.id, ctx.users.tenant1);
    assert.ok(receipt.receipt.receiptNumber);
    assert.equal(receipt.receipt.paymentId, payment1.id);
    assert.equal(receipt.bill.billId, testBill.id);
    assert.equal(receipt.bill.billStatus, 'PAID');
    // All 30,000 was paid, so remaining balance is 0
    assert.equal(receipt.bill.remainingBalance.toString(), '0');
    assert.equal(receipt.tenant.id, ctx.users.tenant1.id);
    assert.ok(receipt.property.name);
    assert.ok(receipt.unit.unitNumber);
  });

  it('17. Scoping: Tenant sees only own payments, Owner sees only property payments', async () => {
    const tenantPayments = await PaymentService.getPayments(ctx.users.tenant1);
    assert.ok(tenantPayments.every((p) => p.tenantId === ctx.users.tenant1.id));

    const owner2Payments = await PaymentService.getPayments(ctx.users.owner2);
    assert.equal(owner2Payments.filter((p) => p.bill.id === testBill.id).length, 0);
  });

  // Cleanup
  it('Cleanup test payments and bill', async () => {
    if (testBill) {
      await prisma.payment.deleteMany({ where: { billId: testBill.id } });
      await prisma.billItem.deleteMany({ where: { billId: testBill.id } });
      await prisma.bill.delete({ where: { id: testBill.id } });
    }
  });
});
