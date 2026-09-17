import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import leaseRoutes from './lease.routes.js';
import billRoutes from './bill.routes.js';
import paymentRoutes from './payment.routes.js';
import { BillController } from '../controllers/bill.controller.js';
import { LeaseController } from '../controllers/lease.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/leases', leaseRoutes);
router.use('/bills', billRoutes);
router.use('/payments', paymentRoutes);

// Dedicated Tenant endpoints
router.get('/tenant/bills', requireAuth, requireRole('TENANT'), BillController.getTenantBills);
router.get('/tenant/lease', requireAuth, requireRole('TENANT'), LeaseController.getTenantCurrentLease);

export default router;
