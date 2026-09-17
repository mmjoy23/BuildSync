import { Router } from 'express';
import { BillController } from '../controllers/bill.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// 1. Tenant dedicated endpoint for their own bills
router.get('/tenant/bills', requireAuth, requireRole('TENANT'), BillController.getTenantBills);

// 2. Generic get bills endpoint (scoped internally by role)
router.get('/', requireAuth, BillController.getBills);

// 3. Get bill by ID (scoped internally by role)
router.get('/:id', requireAuth, BillController.getBillById);

// 4. Create new bill (strictly OWNER & ADMIN)
router.post('/', requireAuth, requireRole('OWNER', 'ADMIN'), BillController.createBill);

export default router;
