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
}
