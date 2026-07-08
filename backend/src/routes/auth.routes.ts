import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

// 💡 What is this file?
// This file defines all the routes (endpoints) related to Authentication.
// Analogy: Like a map that directs delivery drivers where to drop off specific packages.

const router = Router();

// POST /api/auth/login
router.post('/login', AuthController.login);

// POST /api/auth/register
// 💡 What does this do? It lets anyone create a new account.
// NOTE: In a real production app, you would protect ADMIN registration
// behind a secret invite code or restrict it to existing admins only.
// For now, you can pass "role": "ADMIN" in the body to create an admin.
router.post('/register', AuthController.register);

export default router;
