// 💡 What is this file?
// Prisma 7 requires connection URLs to be defined here instead of inside schema.prisma.

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // For Prisma migrate, we must use the direct connection (5432)
    url: process.env["DIRECT_URL"] as string,
  },
});
