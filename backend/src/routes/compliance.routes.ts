import { Router } from 'express';
import { ComplianceController } from '../controllers/compliance.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET /api/compliance
router.get('/', authenticate, ComplianceController.getAll);

// GET /api/compliance/:id
router.get('/:id', authenticate, ComplianceController.getById);

// POST /api/compliance (Admin only)
router.post('/', authenticate, requireAdmin, ComplianceController.create);

// PATCH /api/compliance/:id/status
router.patch('/:id/status', authenticate, ComplianceController.updateStatus);

export default router;
