import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { env } from '../config/env';

// 💡 What is this file?
// This is the Auth Service. It contains the core business logic for authentication.
// Keeping this separate from the controller makes the code cleaner and easier to test.

export class AuthService {
  /**
   * Logs in a user by verifying their email and password.
   * If successful, returns a JWT token.
   */
  static async login(email: string, password: string) {
    // 1. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 2. Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate a JWT token containing user info (payload)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      env.JWT_SECRET as string,
      { expiresIn: '7d' } // Token is valid for 7 days
    );

    // 4. Return the token and user details (excluding password)
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
