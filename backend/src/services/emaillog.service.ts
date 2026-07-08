import prisma from '../db/prisma';

export class EmailLogService {
  static async logEmail(data: {
    weekStart: Date;
    weekEnd: Date;
    recipient: string;
    subject: string;
    status: 'SENT' | 'FAILED';
  }) {
    return prisma.emailLog.create({
      data,
    });
  }

  static async getLogs() {
    return prisma.emailLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50, // Get the last 50 logs
    });
  }
}
