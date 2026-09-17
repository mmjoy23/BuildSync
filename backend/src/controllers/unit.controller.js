import { UnitService } from '../services/unit.service.js';
import { createUnitSchema, updateUnitSchema } from '../validators/unit.validators.js';

export class UnitController {
  static async getUnits(req, res, next) {
    try {
      const units = await UnitService.getUnits(req.params.propertyId, req.user);
      return res.status(200).json({
        success: true,
        data: units,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUnitById(req, res, next) {
    try {
      const unit = await UnitService.getUnitById(req.params.propertyId, req.params.unitId, req.user);
      return res.status(200).json({
        success: true,
        data: unit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createUnit(req, res, next) {
    try {
      const validated = createUnitSchema.parse(req.body);
      const unit = await UnitService.createUnit(req.params.propertyId, validated, req.user);
      return res.status(201).json({
        success: true,
        data: unit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUnit(req, res, next) {
    try {
      const validated = updateUnitSchema.parse(req.body);
      const unit = await UnitService.updateUnit(req.params.propertyId, req.params.unitId, validated, req.user);
      return res.status(200).json({
        success: true,
        data: unit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUnit(req, res, next) {
    try {
      const result = await UnitService.deleteUnit(req.params.propertyId, req.params.unitId, req.user);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
