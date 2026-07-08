import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';

export class ReportController {
  static async getWeekly(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await ReportService.getWeeklyReport();
      res.json({ status: 'success', data: summary });
    } catch (error) {
      next(error);
    }
  }
}
