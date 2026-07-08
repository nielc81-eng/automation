import { Request, Response, NextFunction } from 'express';
import { EmailLogService } from '../services/emaillog.service';

export class EmailLogController {
  static async logEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { weekStart, weekEnd, recipient, subject, status } = req.body;

      if (!weekStart || !weekEnd || !recipient || !subject || !status) {
        const error: any = new Error('Missing required fields');
        error.statusCode = 400;
        throw error;
      }

      if (!['SENT', 'FAILED'].includes(status)) {
        const error: any = new Error('Invalid status');
        error.statusCode = 400;
        throw error;
      }

      const log = await EmailLogService.logEmail({
        weekStart: new Date(weekStart),
        weekEnd: new Date(weekEnd),
        recipient,
        subject,
        status,
      });

      res.status(201).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await EmailLogService.getLogs();
      res.json({ status: 'success', data: logs });
    } catch (error) {
      next(error);
    }
  }
}
