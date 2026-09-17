import prisma from '../config/prisma.js';

export class PropertyService {
  static async getProperties(user) {
    const where = user.role === 'ADMIN' ? {} : { ownerId: user.id };

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        units: {
          select: {
            id: true,
            status: true,
            baseRent: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return properties.map((prop) => {
      const totalUnits = prop.units.length;
      const occupiedUnits = prop.units.filter((u) => u.status === 'OCCUPIED').length;
      const vacantUnits = prop.units.filter((u) => u.status === 'VACANT').length;
      const maintenanceUnits = prop.units.filter((u) => u.status === 'MAINTENANCE').length;
      const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

      const { units, ...rest } = prop;
      return {
        ...rest,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        occupancyRate,
      };
    });
  }

  static async getPropertyById(propertyId, user) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        units: {
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
        },
      },
    });

    if (!property) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'OWNER' && property.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not have access to this property.');
      error.statusCode = 403;
      throw error;
    }

    const totalUnits = property.units.length;
    const occupiedUnits = property.units.filter((u) => u.status === 'OCCUPIED').length;
    const vacantUnits = property.units.filter((u) => u.status === 'VACANT').length;
    const maintenanceUnits = property.units.filter((u) => u.status === 'MAINTENANCE').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    return {
      ...property,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      maintenanceUnits,
      occupancyRate,
    };
  }

  static async createProperty(data, user) {
    let ownerId = user.id;

    if (user.role === 'ADMIN' && data.ownerId) {
      // Validate owner exists and is an OWNER
      const ownerExists = await prisma.user.findUnique({
        where: { id: data.ownerId },
      });
      if (!ownerExists || ownerExists.role !== 'OWNER') {
        const error = new Error('Specified ownerId is not a valid OWNER user');
        error.statusCode = 400;
        throw error;
      }
      ownerId = data.ownerId;
    }

    const property = await prisma.property.create({
      data: {
        ownerId,
        name: data.name,
        address: data.address,
        yearBuilt: data.yearBuilt || null,
        propertyType: data.propertyType || 'Residential',
        status: 'Active',
      },
    });

    return property;
  }

  static async updateProperty(propertyId, data, user) {
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'OWNER' && existingProperty.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not have permission to modify this property.');
      error.statusCode = 403;
      throw error;
    }

    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.address && { address: data.address }),
      ...(data.yearBuilt !== undefined && { yearBuilt: data.yearBuilt }),
      ...(data.propertyType && { propertyType: data.propertyType }),
      ...(data.status && { status: data.status }),
    };

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
    });

    return updated;
  }

  static async deleteProperty(propertyId, user) {
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'OWNER' && existingProperty.ownerId !== user.id) {
      const error = new Error('Forbidden. You do not have permission to delete this property.');
      error.statusCode = 403;
      throw error;
    }

    // Safety checks against deleting dependent records
    const unitCount = await prisma.unit.count({
      where: { propertyId },
    });

    if (unitCount > 0) {
      const error = new Error(
        `Cannot delete property because it has ${unitCount} associated unit(s). Please remove all units first.`
      );
      error.statusCode = 409;
      throw error;
    }

    const expenseCount = await prisma.expense.count({
      where: { propertyId },
    });

    if (expenseCount > 0) {
      const error = new Error('Cannot delete property with associated financial expense records.');
      error.statusCode = 409;
      throw error;
    }

    await prisma.property.delete({
      where: { id: propertyId },
    });

    return { success: true, message: 'Property deleted successfully' };
  }
}
