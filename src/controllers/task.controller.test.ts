import 'reflect-metadata';
import { container } from 'tsyringe';
import { Like } from 'typeorm';
import Task from '../models/task.model';
import TaskService from '../services/task.service';
import { TaskController } from './task.controller';

jest.mock('express');
jest.mock('../models/task.model');
jest.mock('../services/task.service');
jest.mock('../utils/logger');

const taskService = container.resolve(TaskService);
const taskController = new TaskController(taskService);
const next = jest.fn();
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  next.mockClear();
  res.json.mockClear();
  res.status.mockClear();

  (taskService as jest.Mocked<typeof taskService>).save.mockClear();
  (taskService as jest.Mocked<typeof taskService>).create.mockClear();
  (taskService as jest.Mocked<typeof taskService>).findAll.mockClear();
  (taskService as jest.Mocked<typeof taskService>).findById.mockClear();
});

describe('TaskController', () => {
  describe('FindAll', () => {
    it('should return an array with tasks', async () => {
      const query = { page: 1, limit: 10 };
      const total = 0;
      const tasks: Task[] = [];
      const totalPages = Math.ceil(total / query.limit);

      (taskService as jest.Mocked<typeof taskService>).findAll.mockResolvedValue([tasks, total]);
      await taskController.findAll({ query } as any, res as any);

      expect(taskService.findAll).toBeCalledWith({
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        where: expect.anything(),
        order: expect.anything(),
      });
      expect(res.json).toBeCalledWith({ tasks, total, totalPages });
    });

    it('should use default values if not specified in query', async () => {
      const page = 1;
      const limit = 20;
      const query = {};
      const total = 0;
      const tasks: Task[] = [];
      const totalPages = Math.ceil(total / limit);

      (taskService as jest.Mocked<typeof taskService>).findAll.mockResolvedValue([tasks, total]);
      await taskController.findAll({ query } as any, res as any);

      expect(taskService.findAll).toBeCalledWith({
        take: limit,
        skip: (page - 1) * limit,
        where: expect.anything(),
        order: expect.anything(),
      });
      expect(res.json).toBeCalledWith({ tasks, total, totalPages });
    });

    it('should return an array of tasks with filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        title: 'test',
        status: 'pending',
        description: 'test',
        orderById: 'ASC',
      };
      const total = 0;
      const tasks: Task[] = [];
      const totalPages = Math.ceil(total / query.limit);

      (taskService as jest.Mocked<typeof taskService>).findAll.mockResolvedValue([tasks, total]);
      await taskController.findAll({ query } as any, res as any);

      expect(taskService.findAll).toBeCalledWith({
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        where: {
          title: Like(`%${query.title}%`),
          status: Like(`%${query.status}%`),
          description: Like(`%${query.description}%`),
        },
        order: {
          id: 'ASC',
        },
      });
      expect(res.json).toBeCalledWith({ tasks, total, totalPages });
    });

    it('should return 503 if query fails', async () => {
      const query = { page: 1, limit: 10 };

      (taskService as jest.Mocked<typeof taskService>).findAll.mockRejectedValue(new Error());
      await taskController.findAll({ query } as any, res as any);

      expect(taskService.findAll).toBeCalledWith({
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        where: expect.anything(),
        order: expect.anything(),
      });
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });

  describe('findById', () => {
    it('should return a single task by id', async () => {
      const params = { id: '1' };
      const task = { title: 'test' };

      (taskService as jest.Mocked<typeof taskService>).findById.mockResolvedValue(task as any);
      await taskController.findById({ params } as any, res as any);

      expect(taskService.findById).toBeCalledWith(parseInt(params.id, 10));
      expect(res.json).toBeCalledWith(task);
    });

    it('should return 404 if task is not found', async () => {
      const params = { id: '1' };

      (taskService as jest.Mocked<typeof taskService>).findById.mockResolvedValue(undefined);
      await taskController.findById({ params } as any, res as any);

      expect(taskService.findById).toBeCalledWith(parseInt(params.id, 10));
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });

    it('should return 503 if query fails', async () => {
      const params = { id: '1' };

      (taskService as jest.Mocked<typeof taskService>).findById.mockRejectedValue(new Error());
      await taskController.findById({ params } as any, res as any);

      expect(taskService.findById).toBeCalledWith(parseInt(params.id, 10));
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });

  describe('store', () => {
    it('should create a new task', async () => {
      const body = { title: 'test', description: 'test' };
      const task = new Task();
      const now = new Date();

      (taskService as jest.Mocked<typeof taskService>).create.mockReturnValue({
        id: 1, ...body, status: 'pending', createdAt: now, updatedAt: now,
      });
      (taskService as jest.Mocked<typeof taskService>).save.mockResolvedValue(task);
      await taskController.store({ body } as any, res as any);

      expect(taskService.create).toBeCalledWith(body);
      expect(taskService.save).toBeCalled();
      expect(res.status).toBeCalledWith(201);
      expect(res.json).toBeCalledWith({
        id: 1, title: 'test', description: 'test', status: 'pending', createdAt: now, updatedAt: now,
      });
    });

    it('should return 503 if query fails', async () => {
      const body = { title: 'test', description: 'test' };

      (taskService as jest.Mocked<typeof taskService>).save.mockRejectedValue(new Error());
      await taskController.store({ body } as any, res as any);

      expect(taskService.save).toBeCalled();
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });

  describe('replace', () => {
    it('should update a task', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };
      const task = new Task();

      (taskService as jest.Mocked<typeof taskService>).findById.mockResolvedValue(task);
      (taskService as jest.Mocked<typeof taskService>).save.mockResolvedValue(task);
      await taskController.replace({ params, body } as any, res as any);

      expect(task.title).toStrictEqual('test');
      expect(task.description).toStrictEqual('test');
      expect(taskService.save).toBeCalledWith(task);
      expect(res.json).toBeCalledWith(task);
    });

    it('should return 404 if task is not found', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (taskService as jest.Mocked<typeof taskService>).findById.mockResolvedValue(undefined);
      await taskController.replace({ params, body } as any, res as any);

      expect(taskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });

    it('should return 503 if query fails', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (taskService as jest.Mocked<typeof taskService>).findById.mockRejectedValue(new Error());
      await taskController.replace({ params, body } as any, res as any);

      expect(taskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test', status: 'done' };
      const task = new Task();

      (taskService as jest.Mocked<typeof taskService>).findById.mockResolvedValue(task);
      (taskService as jest.Mocked<typeof taskService>).save.mockResolvedValue(task);
      await taskController.update({ params, body } as any, res as any);

      expect(task.title).toStrictEqual('test');
      expect(task.description).toStrictEqual('test');
      expect(task.status).toStrictEqual('done');
      expect(taskService.save).toBeCalledWith(task);
      expect(res.json).toBeCalledWith(task);
    });

    it('should not update property if not specified', async () => {
      const params = { id: '1' };
      const body = {};

      const task = new Task();
      task.title = 'test';
      task.description = 'test';
      task.status = 'done';

      (taskService as jest.Mocked<typeof taskService>).findById.mockResolvedValue(task);
      (taskService as jest.Mocked<typeof taskService>).save.mockResolvedValue(task);
      await taskController.update({ params, body } as any, res as any);

      expect(task.title).toStrictEqual('test');
      expect(task.description).toStrictEqual('test');
      expect(task.status).toStrictEqual('done');
      expect(taskService.save).toBeCalledWith(task);
      expect(res.json).toBeCalledWith(task);
    });

    it('should return 404 if task is not found', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (taskService as jest.Mocked<typeof taskService>).findById.mockResolvedValue(undefined);
      await taskController.update({ params, body } as any, res as any);

      expect(taskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });

    it('should return 503 if query fails', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (taskService as jest.Mocked<typeof taskService>).findById.mockRejectedValue(new Error());
      await taskController.update({ params, body } as any, res as any);

      expect(taskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });
});
