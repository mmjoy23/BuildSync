import { BillService } from '../services/bill.service.js';
import { createBillSchema, getBillsQuerySchema } from '../validators/bill.validators.js';

export class BillController {
  static async createBill(req, res, next) {
    try {
      const validated = createBillSchema.parse(req.body);
      const bill = await BillService.createBill(validated, req.user);
      return res.status(201).json({
        success: true,
        data: bill,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBills(req, res, next) {
    try {
      const validatedQuery = getBillsQuerySchema.parse(req.query);
      const bills = await BillService.getBills(req.user, validatedQuery);
      return res.status(200).json({
        success: true,
        data: bills,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBillById(req, res, next) {
    try {
      const bill = await BillService.getBillById(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        data: bill,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTenantBills(req, res, next) {
    try {
      const validatedQuery = getBillsQuerySchema.parse(req.query);
      const bills = await BillService.getTenantBills(req.user.id, validatedQuery);
      return res.status(200).json({
        success: true,
        data: bills,
      });
    } catch (error) {
      next(error);
    }
  }
}
