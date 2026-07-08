import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config/env';

// 💡 What is this file?
// This file initializes and exports our database connection.
// We use a singleton pattern here so that we don't accidentally create
// thousands of connections to our database when the app reloads.

// We use the pg driver adapter since Prisma 7 requires it for direct connections
const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the pg adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
