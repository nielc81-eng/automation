import { Router } from 'express';
import { EmailLogController } from '../controllers/emaillog.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// POST /api/emaillogs
// Called by n8n after attempting to send the weekly email
router.post('/', authenticate, requireAdmin, EmailLogController.logEmail);

// GET /api/emaillogs
// View past logs (Admin only)
router.get('/', authenticate, requireAdmin, EmailLogController.getLogs);

export default router;
