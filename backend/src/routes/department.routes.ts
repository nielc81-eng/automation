import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// 💡 What is this file?
// This defines the routes for Departments. We protect these routes so only
// logged-in users can view them, and only ADMIN users can create new ones.

// GET /api/departments (Protected: any logged in user)
router.get('/', authenticate, DepartmentController.getAll);

// GET /api/departments/:id (Protected: any logged in user)
router.get('/:id', authenticate, DepartmentController.getById);

// POST /api/departments (Protected: Admin only)
router.post('/', authenticate, requireAdmin, DepartmentController.create);

export default router;
