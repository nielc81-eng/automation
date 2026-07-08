import prisma from '../db/prisma';

export class ReportService {
  static async getWeeklyReport() {
    // 1. Define the time window (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 2. Run both queries at the same time using Promise.all
    // This is faster than running them one after the other!
    // Analogy: Asking two people to search different rooms simultaneously
    // instead of searching one room at a time.
    const [records, adminUsers] = await Promise.all([
      // Query A: Get all compliance records for the report
      prisma.complianceRecord.findMany({
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
      }),

      // Query B: Get all ADMIN users — their emails will be the report recipients
      // This means adding a new admin user automatically adds them to the mailing list!
      prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true },
      }),
    ]);

    // 3. Extract just the email strings from the admin users array
    // e.g., [{ email: 'admin@company.com' }] → ['admin@company.com']
    const adminEmails = adminUsers.map(u => u.email);

    // 4. Process the data into a clean summary format for the email
    const summary = {
      period: {
        start: sevenDaysAgo.toISOString(),
        end: today.toISOString(),
      },
      // 💡 NEW: n8n will read adminEmails and use them as the "To:" field automatically
      adminEmails,
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
