import prisma from '../db/prisma';

// 💡 What is this file?
// This is the Department Service. It handles fetching and creating departments in the DB.

export class DepartmentService {
  static async getAllDepartments() {
    return prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async getDepartmentById(id: string) {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        records: true, // Include compliance records for this department
      },
    });

    if (!department) {
      const error: any = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    return department;
  }

  static async createDepartment(name: string) {
    // Check if it already exists
    const existing = await prisma.department.findUnique({
      where: { name },
    });

    if (existing) {
      const error: any = new Error('Department name already exists');
      error.statusCode = 400;
      throw error;
    }

    return prisma.department.create({
      data: { name },
    });
  }
}
