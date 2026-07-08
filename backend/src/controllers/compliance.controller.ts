import { Request, Response, NextFunction } from 'express';
import { ComplianceService } from '../services/compliance.service';

export class ComplianceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await ComplianceService.getAllRecords();
      res.json({ status: 'success', data: records });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const record = await ComplianceService.getRecordById(id);
      res.json({ status: 'success', data: record });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, dueDate, departmentId, assignedToId } = req.body;
      
      if (!title || !dueDate || !departmentId || !assignedToId) {
        const error: any = new Error('Missing required fields');
        error.statusCode = 400;
        throw error;
      }
      
      const newRecord = await ComplianceService.createRecord({
        title,
        description,
        dueDate: new Date(dueDate),
        departmentId,
        assignedToId
      });
      
      res.status(201).json({ status: 'success', data: newRecord });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!['PENDING', 'COMPLETED', 'OVERDUE'].includes(status)) {
        const error: any = new Error('Invalid status value');
        error.statusCode = 400;
        throw error;
      }

      const updatedRecord = await ComplianceService.updateRecordStatus(id, status);
      res.json({ status: 'success', data: updatedRecord });
    } catch (error) {
      next(error);
    }
  }
}
