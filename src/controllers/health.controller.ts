import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

export default class HealthController {
  static check(req: Request, res: Response) {
    const { isConnected } = getConnection().manager.connection;
    if (!isConnected) {
      return res.status(503).json({ message: 'Not healthy' });
    }
    return res.status(200).json({ message: 'Healthy' });
  }
}
