import prisma from '../src/config/prisma.js';
import { signToken } from '../src/utils/jwt.js';

export async function getTestContext() {
  const admin = await prisma.user.findFirst({ where: { email: 'admin@buildsync.com' } });
  const owner1 = await prisma.user.findFirst({ where: { email: 'owner@buildsync.com' } });
  const owner2 = await prisma.user.findFirst({ where: { email: 'owner2@buildsync.com' } });
  const tenant1 = await prisma.user.findFirst({ where: { email: 'tenant@buildsync.com' } });
  const tenant2 = await prisma.user.findFirst({ where: { email: 'rahim@buildsync.com' } });

  if (!admin || !owner1 || !owner2 || !tenant1 || !tenant2) {
    throw new Error('Seed users are required for test context. Check database seeding.');
  }

  const lease1 = await prisma.lease.findFirst({
    where: { tenantId: tenant1.id, status: 'ACTIVE' },
    include: { unit: { include: { property: true } } },
  });

  const lease2 = await prisma.lease.findFirst({
    where: { tenantId: tenant2.id, status: 'ACTIVE' },
    include: { unit: { include: { property: true } } },
  });

  return {
    users: { admin, owner1, owner2, tenant1, tenant2 },
    leases: { lease1, lease2 },
    tokens: {
      admin: signToken({ userId: admin.id, role: admin.role }),
      owner1: signToken({ userId: owner1.id, role: owner1.role }),
      owner2: signToken({ userId: owner2.id, role: owner2.role }),
      tenant1: signToken({ userId: tenant1.id, role: tenant1.role }),
      tenant2: signToken({ userId: tenant2.id, role: tenant2.role }),
    },
  };
}
