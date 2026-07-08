import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// 💡 What is this file?
// This is the Auth Controller. It receives HTTP requests (like a waiter taking an order),
// hands the data to the service (the kitchen), and sends the response back to the client.

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validate that both fields are provided
      if (!email || !password) {
        const error: any = new Error('Email and password are required');
        error.statusCode = 400;
        throw error;
      }

      // Call the service to perform the actual login logic
      const result = await AuthService.login(email, password);

      // Send a successful JSON response
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      // Pass the error to the global error handler middleware
      next(error);
    }
  }

  /**
   * Handles the POST /api/auth/register request.
   * Validates that the user provided name, email, and password,
   * then calls the service to create the account.
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      // Validate all required fields are present
      if (!name || !email || !password) {
        const error: any = new Error('Name, email and password are required');
        error.statusCode = 400;
        throw error;
      }

      // Basic password length check
      if (password.length < 6) {
        const error: any = new Error('Password must be at least 6 characters');
        error.statusCode = 400;
        throw error;
      }

      // Call the service — only allow ADMIN or EMPLOYEE roles
      const validRole = role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';
      const result = await AuthService.register(name, email, password, validRole);

      // 201 = "Created" — the standard HTTP status for a new resource
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
