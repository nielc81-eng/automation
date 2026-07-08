import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

// 💡 What is this file?
// This file defines all the routes (endpoints) related to Authentication.
// Analogy: Like a map that directs delivery drivers where to drop off specific packages.

const router = Router();

// POST /api/auth/login
router.post('/login', AuthController.login);

export default router;
