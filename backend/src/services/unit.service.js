import prisma from '../config/prisma.js';

export class UnitService {
  static async verifyPropertyAccess(propertyId, user) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'OWNER' && property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not have permission to manage units for this property.');
      error.statusCode = 403;
      throw error;
    }

    return property;
  }

  static async getUnits(propertyId, user) {
    await this.verifyPropertyAccess(propertyId, user);

    const units = await prisma.unit.findMany({
      where: { propertyId },
      include: {
        leases: {
          where: { status: 'ACTIVE' },
          include: {
            tenant: {
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
      orderBy: { unitNumber: 'asc' },
    });

    return units.map((u) => {
      const activeLease = u.leases[0] || null;
      return {
        ...u,
        currentTenant: activeLease ? activeLease.tenant : null,
        activeLease,
      };
    });
  }

  static async getUnitById(propertyId, unitId, user) {
    await this.verifyPropertyAccess(propertyId, user);

    const unit = await prisma.unit.findFirst({
      where: { id: unitId, propertyId },
      include: {
        leases: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: { startDate: 'desc' },
        },
        utilityReadings: {
          take: 5,
          orderBy: { readingDate: 'desc' },
        },
        maintenanceRequests: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!unit) {
      const error = new Error('Unit not found in specified property');
      error.statusCode = 404;
      throw error;
    }

    const activeLease = unit.leases.find((l) => l.status === 'ACTIVE') || null;

    return {
      ...unit,
      currentTenant: activeLease ? activeLease.tenant : null,
      activeLease,
    };
  }

  static async createUnit(propertyId, data, user) {
    await this.verifyPropertyAccess(propertyId, user);

    const existingUnit = await prisma.unit.findUnique({
      where: {
        propertyId_unitNumber: {
          propertyId,
          unitNumber: data.unitNumber,
        },
      },
    });

    if (existingUnit) {
      const error = new Error(`Unit '${data.unitNumber}' already exists in this property.`);
      error.statusCode = 409;
      throw error;
    }

    const unit = await prisma.unit.create({
      data: {
        propertyId,
        unitNumber: data.unitNumber,
        floorNumber: data.floorNumber,
        bedrooms: data.bedrooms !== undefined ? data.bedrooms : null,
        bathrooms: data.bathrooms !== undefined ? data.bathrooms : null,
        areaSqft: data.areaSqft !== undefined ? data.areaSqft : null,
        status: data.status || 'VACANT',
        baseRent: data.baseRent,
      },
    });

    return unit;
  }

  static async updateUnit(propertyId, unitId, data, user) {
    await this.verifyPropertyAccess(propertyId, user);

    const unit = await prisma.unit.findFirst({
      where: { id: unitId, propertyId },
    });

    if (!unit) {
      const error = new Error('Unit not found in specified property');
      error.statusCode = 404;
      throw error;
    }

    // Occupancy validation against active leases
    if (data.status && data.status !== 'OCCUPIED') {
      const activeLease = await prisma.lease.findFirst({
        where: { unitId, status: 'ACTIVE' },
      });

      if (activeLease && data.status === 'VACANT') {
        const error = new Error(
          'Cannot mark unit as VACANT while an active lease is in effect. Terminate the active lease first.'
        );
        error.statusCode = 400;
        throw error;
      }
    }

    // Duplicate unitNumber check
    if (data.unitNumber && data.unitNumber !== unit.unitNumber) {
      const duplicate = await prisma.unit.findUnique({
        where: {
          propertyId_unitNumber: {
            propertyId,
            unitNumber: data.unitNumber,
          },
        },
      });

      if (duplicate) {
        const error = new Error(`Unit '${data.unitNumber}' already exists in this property.`);
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await prisma.unit.update({
      where: { id: unitId },
      data: {
        ...(data.unitNumber && { unitNumber: data.unitNumber }),
        ...(data.floorNumber && { floorNumber: data.floorNumber }),
        ...(data.bedrooms !== undefined && { bedrooms: data.bedrooms }),
        ...(data.bathrooms !== undefined && { bathrooms: data.bathrooms }),
        ...(data.areaSqft !== undefined && { areaSqft: data.areaSqft }),
        ...(data.status && { status: data.status }),
        ...(data.baseRent && { baseRent: data.baseRent }),
      },
    });

    return updated;
  }

  static async deleteUnit(propertyId, unitId, user) {
    await this.verifyPropertyAccess(propertyId, user);

    const unit = await prisma.unit.findFirst({
      where: { id: unitId, propertyId },
    });

    if (!unit) {
      const error = new Error('Unit not found in specified property');
      error.statusCode = 404;
      throw error;
    }

    const activeLease = await prisma.lease.findFirst({
      where: { unitId, status: 'ACTIVE' },
    });

    if (activeLease) {
      const error = new Error('Cannot delete unit with an active lease. Please terminate the lease first.');
      error.statusCode = 409;
      throw error;
    }

    const historicalLeases = await prisma.lease.count({
      where: { unitId },
    });

    if (historicalLeases > 0) {
      const error = new Error('Cannot delete unit with historical lease records. Historical data must be preserved.');
      error.statusCode = 409;
      throw error;
    }

    await prisma.unit.delete({
      where: { id: unitId },
    });

    return { success: true, message: 'Unit deleted successfully' };
  }
}
