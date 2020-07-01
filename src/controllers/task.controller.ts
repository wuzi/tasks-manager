import { Request, Response } from 'express';
import { Like } from 'typeorm';
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
    const { title, description, status } = req.body;
    const task = TaskService.create({ title, description, status });

    try {
      await TaskService.save(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not create the task' });
    }

    return res.status(201).json(task);
  }

  static async replace(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
      const task = await TaskService.findById(parseInt(id, 10));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      task.title = title;
      task.description = description;
      task.status = status;
      await TaskService.save(task);

      return res.json(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not update the task' });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
      const task = await TaskService.findById(parseInt(id, 10));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      await TaskService.save(task);

      return res.json(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not update the task' });
    }
  }
}
