import { Request, Response } from 'express';
import { Like } from 'typeorm';
import TaskService from '../services/task.service';

export default class TaskController {
  static async findAll(req: Request, res: Response) {
    const take = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const skip = req.query.page ? take * (parseInt(req.query.page as string, 10) - 1) : 0;
    const order = { id: req.query.orderById as 'ASC' | 'DESC' | undefined };

    const where: any = {};
    if (req.query.title) where.title = Like(`%${req.query.title}%`);
    if (req.query.status) where.status = Like(`%${req.query.status}%`);
    if (req.query.description) where.description = Like(`%${req.query.description}%`);

    const [tasks, total] = await TaskService.findAll({
      take, skip, where, order,
    });

    return res.json({ tasks, total });
  }
}
