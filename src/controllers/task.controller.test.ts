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
});
