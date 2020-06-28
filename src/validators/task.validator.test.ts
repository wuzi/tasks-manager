import * as validate from '../utils/validate';
import TaskValidator from './task.validator';
import FindAllTaskDto from '../models/dto/find-all-task.dto';
import CreateTaskDto from '../models/dto/create-task.dto';
import UpdateTaskDto from '../models/dto/update-task-dto';
import UpdateTaskPartiallyDto from '../models/dto/update-task-partially-dto';

jest.mock('express');
jest.mock('../models/dto/create-task.dto');
jest.mock('../models/dto/find-all-task.dto');
jest.mock('../models/dto/update-task-dto');
jest.mock('../models/dto/update-task-partially-dto');
jest.mock('../utils/validate');

const next = jest.fn();
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  next.mockClear();
  res.json.mockClear();
  res.status.mockClear();
  (validate as jest.Mocked<typeof validate>).default.mockClear();
});

describe('TaskValidator', () => {
  describe('findAll', () => {
    it('should call next if validation pass', async () => {
      const req = { query: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue([]);
      await TaskValidator.findAll(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(FindAllTaskDto, req.query);
      expect(next).toBeCalled();
    });

    it('should return 422 if validation fails', async () => {
      const req = { query: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue(new Array(3));
      await TaskValidator.findAll(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(FindAllTaskDto, req.query);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(422);
      expect(res.json).toBeCalled();
    });

    it('should return 400 if validation fails due bad data', async () => {
      const req = { query: {} };

      (validate as jest.Mocked<typeof validate>).default.mockRejectedValue(new Error());
      await TaskValidator.findAll(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(FindAllTaskDto, req.query);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    });
  });

  describe('findById', () => {
    it('should call next if validation pass', async () => {
      const req = { params: { id: '1' } };
      await TaskValidator.findById(req as any, res as any, next);
      expect(next).toBeCalled();
    });

    it('should return 404 if id is invalid', async () => {
      const req = { params: { id: 'a' } };
      await TaskValidator.findById(req as any, res as any, next);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalled();
    });
  });

  describe('store', () => {
    it('should call next if validation pass', async () => {
      const req = { body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue([]);
      await TaskValidator.store(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(CreateTaskDto, req.body);
      expect(next).toBeCalled();
    });

    it('should return 422 if validation fails', async () => {
      const req = { body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue(new Array(3));
      await TaskValidator.store(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(CreateTaskDto, req.body);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(422);
      expect(res.json).toBeCalled();
    });

    it('should return 400 if validation fails due bad data', async () => {
      const req = { body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockRejectedValue(new Error());
      await TaskValidator.store(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(CreateTaskDto, req.body);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    });
  });

  describe('update', () => {
    it('should call next if validation pass', async () => {
      const req = { params: { id: '1' }, body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue([]);
      await TaskValidator.update(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(UpdateTaskDto, req.body);
      expect(next).toBeCalled();
    });

    it('should return 404 if id is invalid', async () => {
      const req = { params: { id: 'a' }, body: {} };
      await TaskValidator.update(req as any, res as any, next);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalled();
    });

    it('should return 422 if validation fails', async () => {
      const req = { params: { id: '1' }, body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue(new Array(3));
      await TaskValidator.update(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(UpdateTaskDto, req.body);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(422);
      expect(res.json).toBeCalled();
    });

    it('should return 400 if validation fails due bad data', async () => {
      const req = { params: { id: '1' }, body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockRejectedValue(new Error());
      await TaskValidator.update(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(UpdateTaskDto, req.body);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    });
  });

  describe('updatePartially', () => {
    it('should call next if validation pass', async () => {
      const req = { params: { id: '1' }, body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue([]);
      await TaskValidator.updatePartially(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(UpdateTaskPartiallyDto, req.body);
      expect(next).toBeCalled();
    });

    it('should return 404 if id is invalid', async () => {
      const req = { params: { id: 'a' }, body: {} };
      await TaskValidator.updatePartially(req as any, res as any, next);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalled();
    });

    it('should return 422 if validation fails', async () => {
      const req = { params: { id: '1' }, body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockResolvedValue(new Array(3));
      await TaskValidator.updatePartially(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(UpdateTaskPartiallyDto, req.body);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(422);
      expect(res.json).toBeCalled();
    });

    it('should return 400 if validation fails due bad data', async () => {
      const req = { params: { id: '1' }, body: {} };

      (validate as jest.Mocked<typeof validate>).default.mockRejectedValue(new Error());
      await TaskValidator.updatePartially(req as any, res as any, next);

      expect(validate.default).toBeCalledWith(UpdateTaskPartiallyDto, req.body);
      expect(next).not.toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    });
  });
});
