import { LeaseService } from '../services/lease.service.js';
import { createLeaseSchema, updateLeaseSchema } from '../validators/lease.validators.js';

export class LeaseController {
  static async getLeases(req, res, next) {
    try {
      const leases = await LeaseService.getLeases(req.user, req.query);
      return res.status(200).json({
        success: true,
        data: leases,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLeaseById(req, res, next) {
    try {
      const lease = await LeaseService.getLeaseById(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        data: lease,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTenantCurrentLease(req, res, next) {
    try {
      const lease = await LeaseService.getTenantCurrentLease(req.user.id);
      return res.status(200).json({
        success: true,
        data: lease,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createLease(req, res, next) {
    try {
      const validated = createLeaseSchema.parse(req.body);
      const lease = await LeaseService.createLease(validated, req.user);
      return res.status(201).json({
        success: true,
        data: lease,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLease(req, res, next) {
    try {
      const validated = updateLeaseSchema.parse(req.body);
      const lease = await LeaseService.updateLease(req.params.id, validated, req.user);
      return res.status(200).json({
        success: true,
        data: lease,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLease(req, res, next) {
    try {
      const result = await LeaseService.deleteLease(req.params.id, req.user);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
