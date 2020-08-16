import { Controller, Get, Middleware, Patch, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { inject } from 'tsyringe';
import { Like } from 'typeorm';
import TaskService from '../services/task.service';
import logger from '../utils/logger';
import TaskValidator from '../validators/task.validator';

@Controller('tasks')
export class TaskController {
  constructor(
    @inject('TaskService')
    private taskService: TaskService,
  ) { }

  @Get()
  @Middleware(TaskValidator.findAll)
  public async findAll(req: Request, res: Response) {
    const take = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const skip = req.query.page ? take * (parseInt(req.query.page as string, 10) - 1) : 0;
    const order = { id: req.query.orderById as 'ASC' | 'DESC' | undefined };

    const where: any = {};
    if (req.query.title) where.title = Like(`%${req.query.title}%`);
    if (req.query.status) where.status = Like(`%${req.query.status}%`);
    if (req.query.description) where.description = Like(`%${req.query.description}%`);

    try {
      const [tasks, total] = await this.taskService.findAll({
        take, skip, where, order,
      });

      const totalPages = Math.ceil(total / take);
      return res.json({ tasks, total, totalPages });
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not get the tasks' });
    }
  }

  @Get(':id')
  @Middleware(TaskValidator.findById)
  public async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const task = await this.taskService.findById(parseInt(id, 10));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not get the task' });
    }
  }

  @Post()
  @Middleware(TaskValidator.store)
  public async store(req: Request, res: Response) {
    const { title, description, status } = req.body;
    const task = this.taskService.create({ title, description, status });

    try {
      await this.taskService.save(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not create the task' });
    }

    return res.status(201).json(task);
  }

  @Put(':id')
  @Middleware(TaskValidator.replace)
  public async replace(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
      const task = await this.taskService.findById(parseInt(id, 10));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      task.title = title;
      task.description = description;
      task.status = status;
      await this.taskService.save(task);

      return res.json(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not update the task' });
    }
  }

  @Patch(':id')
  @Middleware(TaskValidator.update)
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
      const task = await this.taskService.findById(parseInt(id, 10));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      await this.taskService.save(task);

      return res.json(task);
    } catch (err) {
      logger('task', err.message, 'error');
      return res.status(503).json({ message: 'Could not update the task' });
    }
  }
}
