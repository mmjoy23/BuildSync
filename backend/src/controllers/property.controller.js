import { PropertyService } from '../services/property.service.js';
import { createPropertySchema, updatePropertySchema } from '../validators/property.validators.js';

export class PropertyController {
  static async getProperties(req, res, next) {
    try {
      const properties = await PropertyService.getProperties(req.user);
      return res.status(200).json({
        success: true,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPropertyById(req, res, next) {
    try {
      const property = await PropertyService.getPropertyById(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProperty(req, res, next) {
    try {
      const validated = createPropertySchema.parse(req.body);
      const property = await PropertyService.createProperty(validated, req.user);
      return res.status(201).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProperty(req, res, next) {
    try {
      const validated = updatePropertySchema.parse(req.body);
      const property = await PropertyService.updateProperty(req.params.id, validated, req.user);
      return res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProperty(req, res, next) {
    try {
      const result = await PropertyService.deleteProperty(req.params.id, req.user);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
