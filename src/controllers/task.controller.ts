import { Request, Response } from 'express';
import { Like } from 'typeorm';
import Task from '../models/task.model';
import TaskService from '../services/task.service';
import logger from '../utils/logger';

export default class TaskController {
  static async findAll(req: Request, res: Response) {
    const take = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const skip = req.query.page ? take * (parseInt(req.query.page as string, 10) - 1) : 0;
    const order = { id: req.query.orderById as 'ASC' | 'DESC' | undefined };

    const where: any = {};
    if (req.query.title) where.title = Like(`%${req.query.title}%`);
    if (req.query.status) where.status = Like(`%${req.query.status}%`);
    if (req.query.description) where.description = Like(`%${req.query.description}%`);

    try {
      const [tasks, total] = await TaskService.findAll({
        take, skip, where, order,
      });

      const totalPages = Math.ceil(total / take);
      return res.json({ tasks, total, totalPages });
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not get the tasks' });
    }
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const task = await TaskService.findById(parseInt(id, 10));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not get the task' });
    }
  }

  static async store(req: Request, res: Response) {
    const task = new Task();
    task.title = req.body.title;
    task.description = req.body.description;
    task.status = req.body.status || 'pending';

    try {
      await TaskService.save(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not create the task' });
    }

    return res.status(201).json(task);
  }
}
