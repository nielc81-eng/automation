import { Request } from 'express';
import { User, Role } from '@prisma/client';

// 💡 What is this file?
// This holds shared TypeScript types that we use in multiple files.
// Analogy: A dictionary of standard terms your whole company agrees to use.

// 1. JWT Payload
// This is the data we pack inside the JWT token when a user logs in.
export interface JwtPayload {
  userId: string;
  role: Role;
}

// 2. Authenticated Request
// When our 'authenticate' middleware runs, it attaches the user data to req.user.
// Express doesn't know about 'req.user' by default, so we extend the standard Request type.
// Now, TypeScript knows that req.user exists and has an 'id' and 'role'.
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}
