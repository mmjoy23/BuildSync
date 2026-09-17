import { PaymentService } from '../services/payment.service.js';
import {
  createPaymentSchema,
  getPaymentsQuerySchema,
} from '../validators/payment.validators.js';

export class PaymentController {
  // POST /api/payments
  static async createPayment(req, res, next) {
    try {
      const validated = createPaymentSchema.parse(req.body);
      const payment = await PaymentService.createPayment(validated, req.user);
      return res.status(201).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/payments
  static async getPayments(req, res, next) {
    try {
      const validatedQuery = getPaymentsQuerySchema.parse(req.query);
      const payments = await PaymentService.getPayments(req.user, validatedQuery);
      return res.status(200).json({ success: true, data: payments });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/payments/:id
  static async getPaymentById(req, res, next) {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id, req.user);
      return res.status(200).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/payments/:id/verify
  static async verifyPayment(req, res, next) {
    try {
      const result = await PaymentService.verifyPayment(req.params.id, req.user);
      const msg = 'Payment verified. Bill status is now ' + result.billStatus + '.';
      return res.status(200).json({
        success: true,
        message: msg,
        data: result.payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/payments/:id/receipt
  static async getReceipt(req, res, next) {
    try {
      const receipt = await PaymentService.getReceipt(req.params.id, req.user);
      return res.status(200).json({ success: true, data: receipt });
    } catch (error) {
      next(error);
    }
  }
}
