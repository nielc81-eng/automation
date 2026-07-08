import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from '../services/department.service';

export class DepartmentController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await DepartmentService.getAllDepartments();
      res.json({ status: 'success', data: departments });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const department = await DepartmentService.getDepartmentById(id);
      res.json({ status: 'success', data: department });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      if (!name) {
        const error: any = new Error('Department name is required');
        error.statusCode = 400;
        throw error;
      }
      
      const newDept = await DepartmentService.createDepartment(name);
      res.status(201).json({ status: 'success', data: newDept });
    } catch (error) {
      next(error);
    }
  }
}
