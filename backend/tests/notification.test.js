import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../src/config/prisma.js';
import { getTestContext } from './test-helpers.js';
import { NotificationService } from '../src/services/notification.service.js';
import { BillService } from '../src/services/bill.service.js';
import { PaymentService } from '../src/services/payment.service.js';

describe('PART 7: Real Database-Backed Notification Tests', () => {
  let ctx;
  let notifTestBillId = null;
  let notifTestPaymentId = null;

  before(async () => {
    ctx = await getTestContext();
    // Clean all notifications for the test users at start
    await prisma.notification.deleteMany({
      where: {
        userId: { in: [ctx.users.tenant1.id, ctx.users.owner1.id, ctx.users.tenant2.id] },
      },
    });
  });

  after(async () => {
    // Must delete payments before bills (RESTRICT FK) and bill items before the bill
    if (notifTestBillId) {
      await prisma.payment.deleteMany({ where: { billId: notifTestBillId } });
      await prisma.billItem.deleteMany({ where: { billId: notifTestBillId } });
      await prisma.bill.deleteMany({ where: { id: notifTestBillId } });
    }
    await prisma.notification.deleteMany({
      where: {
        userId: { in: [ctx.users.tenant1.id, ctx.users.owner1.id, ctx.users.tenant2.id] },
      },
    });
  });

  it('1. NotificationService creates and persists notification in PostgreSQL', async () => {
    // Ensure clean state for tenant1
    await prisma.notification.deleteMany({ where: { userId: ctx.users.tenant1.id } });

    const notif = await NotificationService.createNotification({
      userId: ctx.users.tenant1.id,
      type: 'GENERAL',
      title: 'Welcome to BuildSync',
      message: 'Your account is active.',
    });

    assert.ok(notif.id, 'Notification must have an ID');
    assert.strictEqual(notif.userId, ctx.users.tenant1.id);
    assert.strictEqual(notif.isRead, false);
    assert.strictEqual(notif.type, 'GENERAL');

    const inDb = await prisma.notification.findUnique({ where: { id: notif.id } });
    assert.ok(inDb, 'Must exist directly in PostgreSQL database');
    assert.strictEqual(inDb.title, 'Welcome to BuildSync');
  });

  it('2. Authenticated user retrieves only own notifications, newest first', async () => {
    await NotificationService.createNotification({
      userId: ctx.users.tenant1.id,
      type: 'BILL_CREATED',
      title: 'Second Notification',
      message: 'Newer notification message.',
    });

    const tenant1Notifs = await NotificationService.getUserNotifications(ctx.users.tenant1.id);
    assert.ok(tenant1Notifs.length >= 2, 'Tenant1 should have at least 2 notifications');
    for (const n of tenant1Notifs) {
      assert.strictEqual(n.userId, ctx.users.tenant1.id, 'Must only belong to tenant1');
    }
    assert.strictEqual(tenant1Notifs[0].title, 'Second Notification');

    const tenant2Notifs = await NotificationService.getUserNotifications(ctx.users.tenant2.id);
    assert.strictEqual(tenant2Notifs.length, 0, 'Tenant2 should have 0 notifications');
  });

  it('3. Unread count returns accurate count for user', async () => {
    const unreadInDb = await prisma.notification.count({
      where: { userId: ctx.users.tenant1.id, isRead: false },
    });
    const { count } = await NotificationService.getUnreadCount(ctx.users.tenant1.id);
    assert.strictEqual(count, unreadInDb, 'Unread count must match database count exactly');
  });

  it('4. User can mark own notification as read', async () => {
    const notifs = await NotificationService.getUserNotifications(ctx.users.tenant1.id);
    const target = notifs.find((n) => !n.isRead) || notifs[0];

    const initialUnread = (await NotificationService.getUnreadCount(ctx.users.tenant1.id)).count;
    const updated = await NotificationService.markAsRead(target.id, ctx.users.tenant1.id);
    assert.strictEqual(updated.isRead, true);

    const newUnread = (await NotificationService.getUnreadCount(ctx.users.tenant1.id)).count;
    assert.strictEqual(newUnread, initialUnread - 1, 'Unread count should decrease by 1');
  });

  it('5. User cannot mark another user notification as read (403 Forbidden)', async () => {
    // Create an unread notification for tenant1
    const t1Notif = await NotificationService.createNotification({
      userId: ctx.users.tenant1.id,
      type: 'GENERAL',
      title: 'Private to Tenant 1',
      message: 'Secret notification',
    });

    await assert.rejects(
      async () => {
        await NotificationService.markAsRead(t1Notif.id, ctx.users.tenant2.id);
      },
      (err) => {
        assert.strictEqual(err.statusCode, 403);
        return true;
      }
    );

    const checkDb = await prisma.notification.findUnique({ where: { id: t1Notif.id } });
    assert.strictEqual(checkDb.isRead, false);
  });

  it('6. Mark-all-as-read affects only authenticated user notifications', async () => {
    const t2Notif = await NotificationService.createNotification({
      userId: ctx.users.tenant2.id,
      type: 'GENERAL',
      title: 'Tenant 2 Alert',
      message: 'Private to tenant 2',
    });

    await NotificationService.markAllAsRead(ctx.users.tenant1.id);

    const { count: t1Unread } = await NotificationService.getUnreadCount(ctx.users.tenant1.id);
    assert.strictEqual(t1Unread, 0, 'Tenant1 should have 0 unread now');

    const t2Check = await prisma.notification.findUnique({ where: { id: t2Notif.id } });
    assert.strictEqual(t2Check.isRead, false, 'Tenant2 notification must not be marked read by Tenant1');
  });

  it('7. Bill creation generates BILL_CREATED notification for the tenant', async () => {
    // Clean any prior 2099-01 bill
    await prisma.payment.deleteMany({ where: { bill: { billingMonth: '2099-01' } } });
    await prisma.billItem.deleteMany({ where: { bill: { billingMonth: '2099-01' } } });
    await prisma.bill.deleteMany({ where: { billingMonth: '2099-01' } });

    const billData = {
      leaseId: ctx.leases.lease1.id,
      billingMonth: '2099-01',
      dueDate: new Date('2099-01-15'),
      items: [{ type: 'RENT', description: 'January 2099 Rent', amount: 20000 }],
    };

    const newBill = await BillService.createBill(billData, ctx.users.owner1);
    notifTestBillId = newBill.id;

    const notifs = await NotificationService.getUserNotifications(ctx.users.tenant1.id);
    const billNotif = notifs.find((n) => n.type === 'BILL_CREATED' && n.message.includes('2099-01'));

    assert.ok(billNotif, 'Must create a BILL_CREATED notification for tenant1');
    assert.strictEqual(billNotif.userId, ctx.users.tenant1.id);
  });

  it('8. Payment submission generates PAYMENT_SUBMITTED notification for the property owner', async () => {
    const paymentData = {
      billId: notifTestBillId,
      amount: 10000,
      method: 'BKASH',
      transactionId: 'TXN-NOTIF-TEST-' + Date.now(),
    };

    const payment = await PaymentService.createPayment(paymentData, ctx.users.tenant1);
    notifTestPaymentId = payment.id;

    const ownerNotifs = await NotificationService.getUserNotifications(ctx.users.owner1.id);
    const payNotif = ownerNotifs.find((n) => n.type === 'PAYMENT_SUBMITTED');

    assert.ok(payNotif, 'Owner must receive PAYMENT_SUBMITTED notification');
    assert.strictEqual(payNotif.userId, ctx.users.owner1.id);
    assert.ok(payNotif.message.includes('BKASH'));
  });

  it('9. Partial payment verification generates PAYMENT_VERIFIED notification for tenant', async () => {
    await PaymentService.verifyPayment(notifTestPaymentId, ctx.users.owner1);

    const tenantNotifs = await NotificationService.getUserNotifications(ctx.users.tenant1.id);
    const verifiedNotif = tenantNotifs.find((n) => n.type === 'PAYMENT_VERIFIED');

    assert.ok(verifiedNotif, 'Tenant must receive PAYMENT_VERIFIED notification');
    assert.strictEqual(verifiedNotif.userId, ctx.users.tenant1.id);
  });

  it('10. Full bill payoff generates BILL_PAID notification for tenant', async () => {
    const finalPayment = await PaymentService.createPayment(
      {
        billId: notifTestBillId,
        amount: 10000,
        method: 'CASH',
      },
      ctx.users.tenant1
    );

    await PaymentService.verifyPayment(finalPayment.id, ctx.users.owner1);

    const tenantNotifs = await NotificationService.getUserNotifications(ctx.users.tenant1.id);
    const paidNotif = tenantNotifs.find((n) => n.type === 'BILL_PAID');

    assert.ok(paidNotif, 'Tenant must receive BILL_PAID notification upon full payment');
    assert.strictEqual(paidNotif.userId, ctx.users.tenant1.id);
    // Note: finalPayment cleanup is handled by the after() hook (deletes all payments on testBill)
  });

  it('11. Failed bill creation does NOT create a notification', async () => {
    const beforeCount = await prisma.notification.count({ where: { userId: ctx.users.tenant1.id } });

    await assert.rejects(async () => {
      await BillService.createBill(
        {
          leaseId: ctx.leases.lease1.id,
          billingMonth: '2099-01',
          dueDate: new Date('2099-01-15'),
          items: [{ type: 'RENT', amount: 20000 }],
        },
        ctx.users.owner1
      );
    });

    const afterCount = await prisma.notification.count({ where: { userId: ctx.users.tenant1.id } });
    assert.strictEqual(afterCount, beforeCount, 'No notification should be created when bill creation fails');
  });
});
