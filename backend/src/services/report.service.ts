import prisma from '../db/prisma';

export class ReportService {
  static async getWeeklyReport() {
    // 1. Define the time window (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 2. Query all records (including overdue ones regardless of when they were due)
    const records = await prisma.complianceRecord.findMany({
      where: {
        OR: [
          // Records due in the last 7 days (completed or pending)
          {
            dueDate: {
              gte: sevenDaysAgo,
              lte: today,
            },
          },
          // All currently overdue records (even if due earlier than 7 days ago)
          {
            status: 'OVERDUE',
          },
        ],
      },
      include: {
        department: true,
        assignedTo: { select: { name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    // 3. Process the data into a clean summary format for the email
    const summary = {
      period: {
        start: sevenDaysAgo.toISOString(),
        end: today.toISOString(),
      },
      stats: {
        total: records.length,
        completed: records.filter(r => r.status === 'COMPLETED').length,
        pending: records.filter(r => r.status === 'PENDING').length,
        overdue: records.filter(r => r.status === 'OVERDUE').length,
      },
      records: records.map(r => ({
        id: r.id,
        title: r.title,
        status: r.status,
        dueDate: r.dueDate,
        completedDate: r.completedDate,
        department: r.department.name,
        assignee: r.assignedTo.name,
      })),
    };

    return summary;
  }
}
