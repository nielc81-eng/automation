import prisma from '../db/prisma';

export class ComplianceService {
  static async getAllRecords() {
    return prisma.complianceRecord.findMany({
      include: {
        department: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  static async getRecordById(id: string) {
    const record = await prisma.complianceRecord.findUnique({
      where: { id },
      include: {
        department: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!record) {
      const error: any = new Error('Compliance record not found');
      error.statusCode = 404;
      throw error;
    }

    return record;
  }

  static async createRecord(data: {
    title: string;
    description?: string;
    dueDate: Date;
    departmentId: string;
    assignedToId: string;
  }) {
    return prisma.complianceRecord.create({
      data,
    });
  }

  static async updateRecordStatus(id: string, status: 'PENDING' | 'COMPLETED' | 'OVERDUE') {
    const data: any = { status };

    // If marked as completed, set the completedDate
    if (status === 'COMPLETED') {
      data.completedDate = new Date();
    } else {
      data.completedDate = null;
    }

    return prisma.complianceRecord.update({
      where: { id },
      data,
    });
  }
}
