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
