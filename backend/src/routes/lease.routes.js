import { Router } from 'express';
import { LeaseController } from '../controllers/lease.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Accessible by all authenticated roles, scoped internally in the service layer
router.get('/', requireAuth, LeaseController.getLeases);
router.get('/:id', requireAuth, LeaseController.getLeaseById);

// Modification routes strictly for OWNER & ADMIN
router.post('/', requireAuth, requireRole('OWNER', 'ADMIN'), LeaseController.createLease);
router.put('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), LeaseController.updateLease);
router.delete('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), LeaseController.deleteLease);

export default router;
