import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET /api/reports/weekly (Protected: Admin only for now, since it's sensitive company data)
router.get('/weekly', authenticate, requireAdmin, ReportController.getWeekly);

export default router;
