import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import "dotenv/config";

// 💡 What is this file?
// This is the Database Seed. It automatically creates sample data in your database.
// Analogy: Like stocking a new grocery store with initial inventory before opening day.

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create a hashed password (so we can log in with "password123")
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Create Departments
  const itDept = await prisma.department.upsert({
    where: { name: 'IT' },
    update: {},
    create: { name: 'IT' },
  });

  const hrDept = await prisma.department.upsert({
    where: { name: 'HR' },
    update: {},
    create: { name: 'HR' },
  });

  // 3. Create Users (1 Admin, 1 Employee)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'Admin Boss',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'employee@company.com' },
    update: {},
    create: {
      name: 'Hard Worker',
      email: 'employee@company.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });

  // 4. Create some Compliance Records
  // We'll create one COMPLETED, one PENDING, and one OVERDUE so we have data for the report.
  await prisma.complianceRecord.createMany({
    data: [
      {
        title: 'Q1 Security Training',
        description: 'Mandatory phishing training',
        status: 'COMPLETED',
        dueDate: new Date('2026-06-05T00:00:00Z'),
        completedDate: new Date('2026-06-03T00:00:00Z'),
        departmentId: itDept.id,
        assignedToId: normalUser.id,
      },
      {
        title: 'Review HR Policies',
        description: 'Read the updated handbook',
        status: 'PENDING',
        dueDate: new Date('2026-06-15T00:00:00Z'),
        departmentId: hrDept.id,
        assignedToId: normalUser.id,
      },
      {
        title: 'Server Patching',
        description: 'Update Linux servers to latest kernel',
        status: 'OVERDUE',
        dueDate: new Date('2026-05-20T00:00:00Z'),
        departmentId: itDept.id,
        assignedToId: adminUser.id,
      },
    ],
  });

  console.log('✅ Seeding complete!');
}

// Run the script and handle any errors
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect from the database when done
    await prisma.$disconnect();
  });
