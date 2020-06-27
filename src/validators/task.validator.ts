import Joi from '@hapi/joi';
import { Request, Response } from 'express';

export default class TaskValidator {
  public static async findAll(req: Request, res: Response, next: Function): Promise<Response> {
    const schema = Joi.object({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(100),
      orderById: Joi.string().valid('ASC', 'DESC'),
      title: Joi.string(),
      description: Joi.string(),
    }).unknown(true).required();

    try {
      await schema.validateAsync(req.query, { abortEarly: false });
      return next();
    } catch (err) {
      return res.status(422).json(err);
    }
  }
}
