import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication.

// POST /api/payments — TENANT and ADMIN only (Owner forbidden per spec)
router.post(
  '/',
  requireAuth,
  requireRole('TENANT', 'ADMIN'),
  PaymentController.createPayment
);

// GET /api/payments — all roles, scoped internally by role
router.get('/', requireAuth, PaymentController.getPayments);

// GET /api/payments/:id/receipt — all roles, scoped internally
// NOTE: must be declared BEFORE /:id to avoid route collision
router.get('/:id/receipt', requireAuth, PaymentController.getReceipt);

// GET /api/payments/:id — all roles, scoped internally
router.get('/:id', requireAuth, PaymentController.getPaymentById);

// PATCH /api/payments/:id/verify — OWNER and ADMIN only
router.patch(
  '/:id/verify',
  requireAuth,
  requireRole('OWNER', 'ADMIN'),
  PaymentController.verifyPayment
);

export default router;
