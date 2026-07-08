import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// 💡 What is this file?
// This is the Authentication Middleware. It checks if a user is logged in.
// Analogy: Like a bouncer at a club checking IDs before letting people in.

// We extend the Express Request type to include our user data
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if the Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }

    // 2. Extract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Invalid token format' });
    }

    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as unknown as {
      id: string;
      role: string;
    };

    // 4. Attach the decoded user info to the request object so next routes can use it
    req.user = decoded;

    // 5. Let the user pass to the next function
    next();
  } catch (error) {
    // If token is invalid or expired
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is an Admin
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  }
  next();
};
