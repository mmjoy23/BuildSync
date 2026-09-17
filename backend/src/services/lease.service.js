import prisma from '../config/prisma.js';

export class LeaseService {
  static async getLeases(user, query = {}) {
    let where = {};

    if (user.role === 'ADMIN') {
      where = {
        ...(query.tenantId && { tenantId: query.tenantId }),
        ...(query.unitId && { unitId: query.unitId }),
        ...(query.status && { status: query.status }),
        ...(query.propertyId && { unit: { propertyId: query.propertyId } }),
      };
    } else if (user.role === 'OWNER') {
      where = {
        unit: {
          property: {
            ownerId: user.id,
          },
          ...(query.propertyId && { propertyId: query.propertyId }),
        },
        ...(query.tenantId && { tenantId: query.tenantId }),
        ...(query.unitId && { unitId: query.unitId }),
        ...(query.status && { status: query.status }),
      };
    } else if (user.role === 'TENANT') {
      where = {
        tenantId: user.id,
        ...(query.status && { status: query.status }),
      };
    }

    const leases = await prisma.lease.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                ownerId: true,
              },
            },
          },
        },
        parkingSlots: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return leases;
  }

  static async getLeaseById(leaseId, user) {
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        unit: {
          include: {
            property: {
              include: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        parkingSlots: true,
        bills: {
          take: 12,
          orderBy: { dueDate: 'desc' },
        },
      },
    });

    if (!lease) {
      const error = new Error('Lease not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'TENANT' && lease.tenantId !== user.id) {
      const error = new Error('Forbidden. You do not have access to view this lease.');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'OWNER' && lease.unit.property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not own the property associated with this lease.');
      error.statusCode = 403;
      throw error;
    }

    return lease;
  }

  static async getTenantCurrentLease(tenantId) {
    const activeLease = await prisma.lease.findFirst({
      where: {
        tenantId,
        status: 'ACTIVE',
      },
      include: {
        unit: {
          include: {
            property: {
              include: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        parkingSlots: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return activeLease;
  }

  static async createLease(data, user) {
    // 1. Verify Unit & Property
    const unit = await prisma.unit.findUnique({
      where: { id: data.unitId },
      include: { property: true },
    });

    if (!unit) {
      const error = new Error('Unit not found');
      error.statusCode = 404;
      throw error;
    }

    // 2. Verify Authorization
    if (user.role === 'OWNER' && unit.property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not own the property for this unit.');
      error.statusCode = 403;
      throw error;
    }

    // 3. Verify Tenant
    const tenant = await prisma.user.findUnique({
      where: { id: data.tenantId },
    });

    if (!tenant || tenant.role !== 'TENANT') {
      const error = new Error('Target user does not exist or is not a TENANT.');
      error.statusCode = 400;
      throw error;
    }

    if (tenant.status === 'SUSPENDED') {
      const error = new Error('Target tenant account is suspended.');
      error.statusCode = 400;
      throw error;
    }

    // 4. Prevent Overlapping Active Leases
    const leaseStatus = data.status || 'ACTIVE';
    if (leaseStatus === 'ACTIVE') {
      const activeLease = await prisma.lease.findFirst({
        where: {
          unitId: data.unitId,
          status: 'ACTIVE',
        },
      });

      if (activeLease) {
        const error = new Error(
          'Cannot create an ACTIVE lease. This unit is already actively leased to another tenant.'
        );
        error.statusCode = 409;
        throw error;
      }
    }

    // 5. Database Transaction: Create Lease and sync Unit Occupancy
    const newLease = await prisma.$transaction(async (tx) => {
      const created = await tx.lease.create({
        data: {
          unitId: data.unitId,
          tenantId: data.tenantId,
          startDate: data.startDate,
          endDate: data.endDate || null,
          agreedRent: data.agreedRent,
          status: leaseStatus,
        },
        include: {
          tenant: {
            select: { id: true, name: true, email: true, phone: true },
          },
          unit: {
            include: { property: true },
          },
        },
      });

      if (leaseStatus === 'ACTIVE') {
        await tx.unit.update({
          where: { id: data.unitId },
          data: { status: 'OCCUPIED' },
        });
      }

      return created;
    });

    return newLease;
  }

  static async updateLease(leaseId, data, user) {
    const existingLease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: {
        unit: {
          include: { property: true },
        },
      },
    });

    if (!existingLease) {
      const error = new Error('Lease not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'OWNER' && existingLease.unit.property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not have permission to modify this lease.');
      error.statusCode = 403;
      throw error;
    }

    // Check conflict if activating an inactive lease
    if (data.status === 'ACTIVE' && existingLease.status !== 'ACTIVE') {
      const activeLease = await prisma.lease.findFirst({
        where: {
          unitId: existingLease.unitId,
          status: 'ACTIVE',
          id: { not: leaseId },
        },
      });

      if (activeLease) {
        const error = new Error('Cannot set status to ACTIVE: another active lease exists for this unit.');
        error.statusCode = 409;
        throw error;
      }
    }

    const updatedLease = await prisma.$transaction(async (tx) => {
      const updated = await tx.lease.update({
        where: { id: leaseId },
        data: {
          ...(data.startDate && { startDate: data.startDate }),
          ...(data.endDate !== undefined && { endDate: data.endDate }),
          ...(data.agreedRent && { agreedRent: data.agreedRent }),
          ...(data.status && { status: data.status }),
        },
        include: {
          tenant: { select: { id: true, name: true, email: true, phone: true } },
          unit: { include: { property: true } },
        },
      });

      // Synchronize unit occupancy
      if (data.status === 'TERMINATED' && existingLease.status === 'ACTIVE') {
        const otherActive = await tx.lease.findFirst({
          where: {
            unitId: existingLease.unitId,
            status: 'ACTIVE',
            id: { not: leaseId },
          },
        });

        if (!otherActive) {
          await tx.unit.update({
            where: { id: existingLease.unitId },
            data: { status: 'VACANT' },
          });
        }
      } else if (data.status === 'ACTIVE' && existingLease.status !== 'ACTIVE') {
        await tx.unit.update({
          where: { id: existingLease.unitId },
          data: { status: 'OCCUPIED' },
        });
      }

      return updated;
    });

    return updatedLease;
  }

  static async deleteLease(leaseId, user) {
    const existingLease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: {
        unit: {
          include: { property: true },
        },
      },
    });

    if (!existingLease) {
      const error = new Error('Lease not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'OWNER' && existingLease.unit.property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not have permission to delete this lease.');
      error.statusCode = 403;
      throw error;
    }

    const billCount = await prisma.bill.count({
      where: { leaseId },
    });

    if (billCount > 0) {
      const error = new Error(
        'Cannot delete lease with associated billing history. Please terminate the lease instead to preserve financial records.'
      );
      error.statusCode = 409;
      throw error;
    }

    await prisma.$transaction(async (tx) => {
      await tx.lease.delete({
        where: { id: leaseId },
      });

      if (existingLease.status === 'ACTIVE') {
        const otherActive = await tx.lease.findFirst({
          where: { unitId: existingLease.unitId, status: 'ACTIVE' },
        });
        if (!otherActive) {
          await tx.unit.update({
            where: { id: existingLease.unitId },
            data: { status: 'VACANT' },
          });
        }
      }
    });

    return { success: true, message: 'Lease deleted successfully' };
  }
}
