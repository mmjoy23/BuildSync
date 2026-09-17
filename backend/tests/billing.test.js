import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BillService } from '../src/services/bill.service.js';
import { createBillSchema } from '../src/validators/bill.validators.js';
import { getTestContext } from './test-helpers.js';
import prisma from '../src/config/prisma.js';
import { Prisma } from '@prisma/client';

describe('PART 5: Billing Tests', () => {
  let ctx;
  let testBillId = null;
  const testBillingMonth = '2027-01';

  it('0. Setup test context and clean old test bills', async () => {
    ctx = await getTestContext();
    await prisma.billItem.deleteMany({ where: { bill: { billingMonth: testBillingMonth } } });
    await prisma.bill.deleteMany({ where: { billingMonth: testBillingMonth } });
  });

  it('1. Owner creates bill for own lease with backend calculation', async () => {
    const billData = {
      leaseId: ctx.leases.lease1.id,
      billingMonth: testBillingMonth,
      dueDate: new Date('2027-01-10'),
      items: [
        { type: 'RENT', description: 'January Rent', amount: 20000 },
        { type: 'ELECTRICITY', description: 'Power usage', amount: 2500.50 },
        { type: 'WATER', description: 'Water bill', amount: 500 },
        { type: 'GAS', description: 'Gas supply', amount: 1080 },
        { type: 'SERVICE_CHARGE', description: 'Monthly service', amount: 2000 },
        { type: 'PARKING', description: 'Car parking', amount: 1000 },
      ],
    };

    const bill = await BillService.createBill(billData, ctx.users.owner1);
    assert.ok(bill.id);
    testBillId = bill.id;

    // 9. Backend calculates total independently: 20000 + 2500.50 + 500 + 1080 + 2000 + 1000 = 27080.50
    assert.equal(bill.totalAmount.toString(), '27080.5');
    assert.equal(bill.status, 'PENDING');
    // 10. BillItems created atomically
    assert.equal(bill.items.length, 6);
  });

  it('2. Tenant cannot create a bill', async () => {
    await assert.rejects(
      async () => {
        await BillService.createBill({
          leaseId: ctx.leases.lease1.id,
          billingMonth: '2027-02',
          dueDate: new Date('2027-02-10'),
          items: [{ type: 'RENT', amount: 10000 }],
        }, ctx.users.tenant1);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Tenants cannot create bills'));
        return true;
      }
    );
  });

  it('3. Owner cannot create bill for another owners lease', async () => {
    await assert.rejects(
      async () => {
        await BillService.createBill({
          leaseId: ctx.leases.lease1.id,
          billingMonth: '2027-02',
          dueDate: new Date('2027-02-10'),
          items: [{ type: 'RENT', amount: 10000 }],
        }, ctx.users.owner2);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Forbidden'));
        return true;
      }
    );
  });

  it('4. Admin can create/view bills according to authorization', async () => {
    const bills = await BillService.getBills(ctx.users.admin, { billingMonth: testBillingMonth });
    assert.ok(bills.length >= 1);
    assert.ok(bills.some((b) => b.id === testBillId));
  });

  it('5. Bill requires valid items (empty item list is rejected by Zod)', () => {
    assert.throws(
      () => {
        createBillSchema.parse({
          leaseId: ctx.leases.lease1.id,
          billingMonth: '2027-03',
          dueDate: '2027-03-10',
          items: [],
        });
      },
      (err) => {
        assert.ok(err.errors.some((e) => e.message.includes('At least one bill item is required')));
        return true;
      }
    );
  });

  it('6. Negative amounts in items are rejected by Zod', () => {
    assert.throws(
      () => {
        createBillSchema.parse({
          leaseId: ctx.leases.lease1.id,
          billingMonth: '2027-03',
          dueDate: '2027-03-10',
          items: [{ type: 'RENT', amount: -500 }],
        });
      },
      (err) => {
        assert.ok(err.errors.some((e) => e.message.includes('non-negative')));
        return true;
      }
    );
  });

  it('7. Invalid item types are rejected by Zod', () => {
    assert.throws(
      () => {
        createBillSchema.parse({
          leaseId: ctx.leases.lease1.id,
          billingMonth: '2027-03',
          dueDate: '2027-03-10',
          items: [{ type: 'NON_EXISTENT_TYPE', amount: 1000 }],
        });
      },
      (err) => {
        assert.ok(err.errors.length > 0);
        return true;
      }
    );
  });

  it('8. Duplicate bill for same lease + billing month is rejected (409)', async () => {
    await assert.rejects(
      async () => {
        await BillService.createBill({
          leaseId: ctx.leases.lease1.id,
          billingMonth: testBillingMonth,
          dueDate: new Date('2027-01-10'),
          items: [{ type: 'RENT', amount: 20000 }],
        }, ctx.users.owner1);
      },
      (err) => {
        assert.equal(err.statusCode, 409);
        assert.ok(err.message.includes('already exists'));
        return true;
      }
    );
  });

  it('9. Tenant can view only own bills', async () => {
    const tenant1Bills = await BillService.getBills(ctx.users.tenant1);
    assert.ok(tenant1Bills.every((b) => b.lease.tenant.id === ctx.users.tenant1.id));
  });

  it('10. Owner can view only bills for owned properties', async () => {
    const owner2Bills = await BillService.getBills(ctx.users.owner2, { billingMonth: testBillingMonth });
    // Owner 2 does not own property for lease1
    assert.equal(owner2Bills.filter((b) => b.id === testBillId).length, 0);
  });

  it('11. Bill detail includes appropriate item/lease/property/unit/tenant info', async () => {
    const bill = await BillService.getBillById(testBillId, ctx.users.owner1);
    assert.ok(bill.items);
    assert.ok(bill.lease);
    assert.ok(bill.lease.tenant);
    assert.ok(bill.lease.unit);
    assert.ok(bill.lease.unit.property);
  });

  it('12. Password hashes and sensitive fields are never exposed', async () => {
    const bill = await BillService.getBillById(testBillId, ctx.users.owner1);
    assert.strictEqual(bill.lease.tenant.passwordHash, undefined);
    assert.strictEqual(bill.lease.tenant.password, undefined);
  });

  // Cleanup
  it('Cleanup test billing data', async () => {
    if (testBillId) {
      await prisma.billItem.deleteMany({ where: { billId: testBillId } });
      await prisma.bill.delete({ where: { id: testBillId } });
    }
  });
});
