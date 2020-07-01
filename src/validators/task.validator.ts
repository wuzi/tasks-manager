import { Request, Response } from 'express';
import CreateTaskDto from '../models/dto/create-task.dto';
import FindAllTaskDto from '../models/dto/find-all-task.dto';
import ReplaceTaskDto from '../models/dto/replace-task-dto';
import UpdateTaskDto from '../models/dto/update-task-dto';
import validate from '../utils/validate';

export default class TaskValidator {
  public static async findAll(req: Request, res: Response, next: Function): Promise<Response> {
    try {
      const errors = await validate(FindAllTaskDto, req.query);
      if (errors.length > 0) {
        return res.status(422).json(errors);
      }
      return next();
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  public static async findById(req: Request, res: Response, next: Function): Promise<Response> {
    if (Number.isNaN(parseInt(req.params.id, 10))) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return next();
  }

  public static async store(req: Request, res: Response, next: Function): Promise<Response> {
    try {
      const errors = await validate(CreateTaskDto, req.body);
      if (errors.length > 0) {
        return res.status(422).json(errors);
      }
      return next();
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  public static async replace(req: Request, res: Response, next: Function): Promise<Response> {
    if (Number.isNaN(parseInt(req.params.id, 10))) {
      return res.status(404).json({ message: 'Task not found' });
    }
    try {
      const errors = await validate(ReplaceTaskDto, req.body);
      if (errors.length > 0) {
        return res.status(422).json(errors);
      }
      return next();
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  public static async update(req: Request, res: Response, next: Function): Promise<Response> {
    if (Number.isNaN(parseInt(req.params.id, 10))) {
      return res.status(404).json({ message: 'Task not found' });
    }
    try {
      const errors = await validate(UpdateTaskDto, req.body);
      if (errors.length > 0) {
        return res.status(422).json(errors);
      }
      return next();
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}
