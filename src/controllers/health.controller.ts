import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

@Controller('health')
export class HealthController {
  @Get()
  public check(req: Request, res: Response) {
    const { isConnected } = getConnection().manager.connection;
    if (!isConnected) {
      return res.status(503).json({ message: 'Not healthy' });
    }
    return res.status(200).json({ message: 'Healthy' });
  }
}
