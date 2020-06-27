import { Like } from 'typeorm';
import Task from '../models/task.model';
import TaskService from '../services/task.service';
import TaskController from './task.controller';

jest.mock('express');
jest.mock('../models/task.model');
jest.mock('../services/task.service');
jest.mock('../utils/logger');

const next = jest.fn();
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  next.mockClear();
  res.json.mockClear();
  res.status.mockClear();

  (TaskService as jest.Mocked<typeof TaskService>).save.mockClear();
  (TaskService as jest.Mocked<typeof TaskService>).findAll.mockClear();
  (TaskService as jest.Mocked<typeof TaskService>).findById.mockClear();
});

describe('TaskController', () => {
  describe('FindAll', () => {
    it('should return an array with tasks', async () => {
      const query = { page: 1, limit: 10 };
      const total = 0;
      const tasks: Task[] = [];
      const totalPages = Math.ceil(total / query.limit);

      (TaskService as jest.Mocked<typeof TaskService>).findAll.mockResolvedValue([tasks, total]);
      await TaskController.findAll({ query } as any, res as any);

      expect(TaskService.findAll).toBeCalledWith({
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

      (TaskService as jest.Mocked<typeof TaskService>).findAll.mockResolvedValue([tasks, total]);
      await TaskController.findAll({ query } as any, res as any);

      expect(TaskService.findAll).toBeCalledWith({
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

      (TaskService as jest.Mocked<typeof TaskService>).findAll.mockResolvedValue([tasks, total]);
      await TaskController.findAll({ query } as any, res as any);

      expect(TaskService.findAll).toBeCalledWith({
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

      (TaskService as jest.Mocked<typeof TaskService>).findAll.mockRejectedValue(new Error());
      await TaskController.findAll({ query } as any, res as any);

      expect(TaskService.findAll).toBeCalledWith({
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

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockResolvedValue(task as any);
      await TaskController.findById({ params } as any, res as any);

      expect(TaskService.findById).toBeCalledWith(parseInt(params.id, 10));
      expect(res.json).toBeCalledWith(task);
    });

    it('should return 404 if task is not found', async () => {
      const params = { id: '1' };

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockResolvedValue(undefined);
      await TaskController.findById({ params } as any, res as any);

      expect(TaskService.findById).toBeCalledWith(parseInt(params.id, 10));
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });

    it('should return 503 if query fails', async () => {
      const params = { id: '1' };

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockRejectedValue(new Error());
      await TaskController.findById({ params } as any, res as any);

      expect(TaskService.findById).toBeCalledWith(parseInt(params.id, 10));
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });

  describe('store', () => {
    it('should create a new task', async () => {
      const body = { title: 'test', description: 'test' };
      const task = new Task();

      (TaskService as jest.Mocked<typeof TaskService>).save.mockResolvedValue(task);
      await TaskController.store({ body } as any, res as any);

      expect(TaskService.save).toBeCalled();
      expect(res.status).toBeCalledWith(201);
      expect(res.json).toBeCalled();
    });

    it('should return 503 if query fails', async () => {
      const body = { title: 'test', description: 'test' };

      (TaskService as jest.Mocked<typeof TaskService>).save.mockRejectedValue(new Error());
      await TaskController.store({ body } as any, res as any);

      expect(TaskService.save).toBeCalled();
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };
      const task = new Task();

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockResolvedValue(task);
      (TaskService as jest.Mocked<typeof TaskService>).save.mockResolvedValue(task);
      await TaskController.update({ params, body } as any, res as any);

      expect(task.title).toStrictEqual('test');
      expect(task.description).toStrictEqual('test');
      expect(TaskService.save).toBeCalledWith(task);
      expect(res.json).toBeCalledWith(task);
    });

    it('should return 404 if task is not found', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockResolvedValue(undefined);
      await TaskController.update({ params, body } as any, res as any);

      expect(TaskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });

    it('should return 503 if query fails', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockRejectedValue(new Error());
      await TaskController.update({ params, body } as any, res as any);

      expect(TaskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });

  describe('updatePartially', () => {
    it('should update a task partially', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test', status: 'done' };
      const task = new Task();

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockResolvedValue(task);
      (TaskService as jest.Mocked<typeof TaskService>).save.mockResolvedValue(task);
      await TaskController.updatePartially({ params, body } as any, res as any);

      expect(task.title).toStrictEqual('test');
      expect(task.description).toStrictEqual('test');
      expect(task.status).toStrictEqual('done');
      expect(TaskService.save).toBeCalledWith(task);
      expect(res.json).toBeCalledWith(task);
    });

    it('should not update property if not specified', async () => {
      const params = { id: '1' };
      const body = {};

      const task = new Task();
      task.title = 'test';
      task.description = 'test';
      task.status = 'done';

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockResolvedValue(task);
      (TaskService as jest.Mocked<typeof TaskService>).save.mockResolvedValue(task);
      await TaskController.updatePartially({ params, body } as any, res as any);

      expect(task.title).toStrictEqual('test');
      expect(task.description).toStrictEqual('test');
      expect(task.status).toStrictEqual('done');
      expect(TaskService.save).toBeCalledWith(task);
      expect(res.json).toBeCalledWith(task);
    });

    it('should return 404 if task is not found', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockResolvedValue(undefined);
      await TaskController.updatePartially({ params, body } as any, res as any);

      expect(TaskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });

    it('should return 503 if query fails', async () => {
      const params = { id: '1' };
      const body = { title: 'test', description: 'test' };

      (TaskService as jest.Mocked<typeof TaskService>).findById.mockRejectedValue(new Error());
      await TaskController.updatePartially({ params, body } as any, res as any);

      expect(TaskService.save).not.toBeCalled();
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });
});
