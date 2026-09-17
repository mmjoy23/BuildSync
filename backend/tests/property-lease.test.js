import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PropertyService } from '../src/services/property.service.js';
import { UnitService } from '../src/services/unit.service.js';
import { LeaseService } from '../src/services/lease.service.js';
import { getTestContext } from './test-helpers.js';
import prisma from '../src/config/prisma.js';

describe('PART 4: Property, Unit & Lease Tests', () => {
  let ctx;
  let testPropertyId;
  let testUnitId;
  let testLeaseId;

  it('0. Setup test context', async () => {
    ctx = await getTestContext();
    assert.ok(ctx.users.owner1);
    assert.ok(ctx.users.owner2);
    assert.ok(ctx.users.tenant1);
    assert.ok(ctx.users.admin);
  });

  it('1. Owner can create property', async () => {
    const prop = await PropertyService.createProperty({
      name: 'Automated Test Plaza',
      address: '77 Test Ave, Dhaka',
      propertyType: 'Commercial',
      yearBuilt: 2024,
    }, ctx.users.owner1);

    assert.ok(prop.id);
    assert.equal(prop.name, 'Automated Test Plaza');
    assert.equal(prop.ownerId, ctx.users.owner1.id);
    testPropertyId = prop.id;
  });

  it('2. Owner can view own property', async () => {
    const prop = await PropertyService.getPropertyById(testPropertyId, ctx.users.owner1);
    assert.equal(prop.id, testPropertyId);
    assert.equal(prop.name, 'Automated Test Plaza');
  });

  it('3. Owner cannot access another owners property', async () => {
    await assert.rejects(
      async () => {
        await PropertyService.getPropertyById(testPropertyId, ctx.users.owner2);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Forbidden'));
        return true;
      }
    );
  });

  it('4. Owner can create units under own property', async () => {
    const unit = await UnitService.createUnit(testPropertyId, {
      unitNumber: 'T-101',
      floorNumber: '1st',
      bedrooms: 3,
      bathrooms: 2,
      areaSqft: 1500,
      status: 'VACANT',
      baseRent: '25000',
    }, ctx.users.owner1);

    assert.ok(unit.id);
    assert.equal(unit.unitNumber, 'T-101');
    assert.equal(unit.status, 'VACANT');
    testUnitId = unit.id;
  });

  it('5. Owner cannot manipulate another owners units', async () => {
    await assert.rejects(
      async () => {
        await UnitService.createUnit(testPropertyId, {
          unitNumber: 'T-102',
          floorNumber: '1st',
          baseRent: '20000',
        }, ctx.users.owner2);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        return true;
      }
    );
  });

  it('6. Lease can be created for an available unit', async () => {
    const lease = await LeaseService.createLease({
      unitId: testUnitId,
      tenantId: ctx.users.tenant1.id,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      agreedRent: '25000',
      status: 'ACTIVE',
    }, ctx.users.owner1);

    assert.ok(lease.id);
    assert.equal(lease.status, 'ACTIVE');
    assert.equal(lease.tenantId, ctx.users.tenant1.id);
    testLeaseId = lease.id;
  });

  it('7. Active lease marks unit OCCUPIED', async () => {
    const unit = await prisma.unit.findUnique({ where: { id: testUnitId } });
    assert.equal(unit.status, 'OCCUPIED', 'Unit status must automatically update to OCCUPIED on active lease');
  });

  it('8. Active lease conflict is prevented (cannot double-lease unit)', async () => {
    await assert.rejects(
      async () => {
        await LeaseService.createLease({
          unitId: testUnitId,
          tenantId: ctx.users.tenant2.id,
          startDate: new Date('2026-02-01'),
          agreedRent: '25000',
          status: 'ACTIVE',
        }, ctx.users.owner1);
      },
      (err) => {
        assert.equal(err.statusCode, 409);
        assert.ok(err.message.includes('already actively leased'));
        return true;
      }
    );
  });

  it('9. Tenant can access own current lease', async () => {
    const lease = await LeaseService.getLeaseById(testLeaseId, ctx.users.tenant1);
    assert.equal(lease.id, testLeaseId);
    assert.equal(lease.tenantId, ctx.users.tenant1.id);
  });

  it('10. Tenant cannot access another tenants lease', async () => {
    await assert.rejects(
      async () => {
        await LeaseService.getLeaseById(testLeaseId, ctx.users.tenant2);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Forbidden'));
        return true;
      }
    );
  });

  it('11. Admin has appropriate global access', async () => {
    const lease = await LeaseService.getLeaseById(testLeaseId, ctx.users.admin);
    assert.equal(lease.id, testLeaseId);
    const prop = await PropertyService.getPropertyById(testPropertyId, ctx.users.admin);
    assert.equal(prop.id, testPropertyId);
  });

  it('12. Lease termination updates unit appropriately to VACANT', async () => {
    await LeaseService.updateLease(testLeaseId, { status: 'TERMINATED' }, ctx.users.owner1);
    const unit = await prisma.unit.findUnique({ where: { id: testUnitId } });
    assert.equal(unit.status, 'VACANT', 'Terminated lease must revert unit to VACANT');
  });

  // Clean up test data
  it('Cleanup test property, unit, and lease', async () => {
    if (testLeaseId) {
      await prisma.lease.delete({ where: { id: testLeaseId } });
    }
    if (testUnitId) {
      await prisma.unit.delete({ where: { id: testUnitId } });
    }
    if (testPropertyId) {
      await prisma.property.delete({ where: { id: testPropertyId } });
    }
  });
});
