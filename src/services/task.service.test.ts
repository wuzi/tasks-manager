import * as typeorm from 'typeorm';
import TaskService from './task.service';
import Task from '../models/task.model';

describe('TaskService', () => {
  describe('findAll', () => {
    it('should return an array with tasks and count', async () => {
      (typeorm as jest.Mocked<typeof typeorm>).getConnection = jest.fn().mockReturnValue({
        getRepository: jest.fn().mockReturnValue({
          findAndCount: jest.fn().mockReturnValue([[], 0]),
        }),
      });
      const [tasks, total] = await TaskService.findAll();
      expect(Array.isArray(tasks)).toBe(true);
      expect(typeof total === 'number').toBe(true);
    });
  });

  describe('findById', () => {
    it('should return a single task by id', async () => {
      const task = new Task();
      (typeorm as jest.Mocked<typeof typeorm>).getConnection = jest.fn().mockReturnValue({
        getRepository: jest.fn().mockReturnValue({
          findOne: jest.fn().mockReturnValue(task),
        }),
      });
      const foundTask = await TaskService.findById(1);
      expect(foundTask).toStrictEqual(task);
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const task = {
        title: 'test', description: 'test', status: 'done',
      };
      (typeorm as jest.Mocked<typeof typeorm>).getConnection = jest.fn().mockReturnValue({
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue({ id: 1, ...task }),
        }),
      });
      const newTask = TaskService.create(task as Task);
      expect(newTask).toHaveProperty('id');
      expect(newTask.title).toStrictEqual('test');
      expect(newTask.description).toStrictEqual('test');
      expect(newTask.status).toStrictEqual('done');
    });

    it('should create a task with pending status if not specified', async () => {
      const task = {
        title: 'test', description: 'test',
      };
      (typeorm as jest.Mocked<typeof typeorm>).getConnection = jest.fn().mockReturnValue({
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue({ id: 1, ...task, status: 'pending' }),
        }),
      });
      const newTask = TaskService.create(task);
      expect(newTask).toHaveProperty('id');
      expect(newTask).toHaveProperty('title');
      expect(newTask).toHaveProperty('description');
      expect(newTask).toHaveProperty('status');
      expect(newTask.status).toStrictEqual('pending');
    });
  });

  describe('save', () => {
    it('should save a task', async () => {
      const task = new Task();
      (typeorm as jest.Mocked<typeof typeorm>).getConnection = jest.fn().mockReturnValue({
        getRepository: jest.fn().mockReturnValue({
          save: jest.fn().mockReturnValue(task),
        }),
      });
      const savedTask = await TaskService.save(task);
      expect(savedTask).toStrictEqual(task);
    });
  });
});
