import * as typeorm from 'typeorm';
import { HealthController } from './health.controller';

jest.mock('express');
jest.mock('typeorm');

const healthController = new HealthController();
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  res.json.mockClear();
  res.status.mockClear();
  (typeorm as jest.Mocked<any>).getConnection.mockClear();
});

describe('HealthController', () => {
  describe('check', () => {
    it('should return 200 if it has a database connection', async () => {
      (typeorm as jest.Mocked<any>).getConnection.mockReturnValue({
        manager: {
          connection: {
            isConnected: true,
          },
        },
      });
      healthController.check({} as any, res as any);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });

    it('should return 503 if database is not connected', async () => {
      (typeorm as jest.Mocked<any>).getConnection.mockReturnValue({
        manager: {
          connection: {
            isConnected: false,
          },
        },
      });
      healthController.check({} as any, res as any);
      expect(res.status).toBeCalledWith(503);
      expect(res.json).toBeCalledWith({ message: expect.anything() });
    });
  });
});
