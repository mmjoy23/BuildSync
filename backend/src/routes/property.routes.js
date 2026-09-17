import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller.js';
import { UnitController } from '../controllers/unit.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Property management routes (Owner & Admin only)
router.get('/', requireAuth, requireRole('OWNER', 'ADMIN'), PropertyController.getProperties);
router.get('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), PropertyController.getPropertyById);
router.post('/', requireAuth, requireRole('OWNER', 'ADMIN'), PropertyController.createProperty);
router.put('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), PropertyController.updateProperty);
router.delete('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), PropertyController.deleteProperty);

// Nested Unit management routes
router.get('/:propertyId/units', requireAuth, requireRole('OWNER', 'ADMIN'), UnitController.getUnits);
router.get('/:propertyId/units/:unitId', requireAuth, requireRole('OWNER', 'ADMIN'), UnitController.getUnitById);
router.post('/:propertyId/units', requireAuth, requireRole('OWNER', 'ADMIN'), UnitController.createUnit);
router.put('/:propertyId/units/:unitId', requireAuth, requireRole('OWNER', 'ADMIN'), UnitController.updateUnit);
router.delete('/:propertyId/units/:unitId', requireAuth, requireRole('OWNER', 'ADMIN'), UnitController.deleteUnit);

export default router;
