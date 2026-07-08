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

  /**
   * Registers a new user.
   * It hashes their password before saving to the database.
   * Analogy: Like filling out a membership form. We take your details,
   * shred the plain-text password, and store only the scrambled version.
   */
  static async register(
    name: string,
    email: string,
    password: string,
    role: 'ADMIN' | 'EMPLOYEE' = 'EMPLOYEE' // Default role is EMPLOYEE
  ) {
    // 1. Check if a user with this email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const error: any = new Error('Email already in use');
      error.statusCode = 409; // 409 = Conflict
      throw error;
    }

    // 2. Hash the plain-text password before saving
    // The "10" is the number of salt rounds — more rounds = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // 4. Immediately generate a token so they are logged in after registering
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    };
  }
}
