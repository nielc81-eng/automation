import { z } from 'zod';
import dotenv from 'dotenv';

// Load variables from .env file into process.env
dotenv.config();

// 💡 What is this file?
// This validates our Environment Variables when the server starts.
// Analogy: Checking if you have all the necessary ingredients before you start cooking.
// If DATABASE_URL is missing, the server will crash immediately with a helpful error,
// instead of crashing mysteriously later when someone tries to log in.

// 1. Define what our environment variables MUST look like
const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid URL"),
  PORT: z.string().default("3000"), // If not provided, defaults to 3000
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters long"),
  
  // These are optional for now, we'll need them in Phase 8 (n8n & Email)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
  EMAIL_FROM: z.string().email("EMAIL_FROM must be a valid email").optional().or(z.literal("")),
});

// 2. Validate the current process.env against our schema
// Export the clean, validated variables for the rest of the app to use
export const env = (() => {
  try {
    return envSchema.parse(process.env);
  } catch (error: any) {
    console.error("❌ Invalid environment variables:", error.format ? error.format() : error);
    process.exit(1);
  }
})();
