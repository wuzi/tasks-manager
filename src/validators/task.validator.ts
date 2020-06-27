import Joi from '@hapi/joi';
import { Request, Response } from 'express';

export default class TaskValidator {
  public static async findAll(req: Request, res: Response, next: Function): Promise<Response> {
    const schema = Joi.object({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(100),
      orderById: Joi.string().valid('ASC', 'DESC'),
      title: Joi.string(),
      status: Joi.string().valid('pending', 'in progress', 'done'),
      description: Joi.string(),
    }).required();

    try {
      req.query = await schema.validateAsync(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });
      return next();
    } catch (err) {
      return res.status(422).json(err);
    }
  }

  public static async findById(req: Request, res: Response, next: Function): Promise<Response> {
    const schema = Joi.object({
      id: Joi.number().integer(),
    }).required();

    try {
      req.params = await schema.validateAsync(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });
      return next();
    } catch (err) {
      return res.status(422).json(err);
    }
  }

  public static async store(req: Request, res: Response, next: Function): Promise<Response> {
    const schema = Joi.object({
      title: Joi.string().required(),
      status: Joi.string().valid('pending', 'in progress', 'done'),
      description: Joi.string().required(),
    }).required();

    try {
      req.body = await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return next();
    } catch (err) {
      return res.status(422).json(err);
    }
  }

  public static async update(req: Request, res: Response, next: Function): Promise<Response> {
    const paramsSchema = Joi.object({
      id: Joi.number().integer(),
    }).required();

    const bodySchema = Joi.object({
      title: Joi.string().required(),
      status: Joi.string().valid('pending', 'in progress', 'done').required(),
      description: Joi.string().required(),
    }).required();

    try {
      req.params = await paramsSchema.validateAsync(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.body = await bodySchema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return next();
    } catch (err) {
      return res.status(422).json(err);
    }
  }

  public static async updatePartially(
    req: Request, res: Response, next: Function,
  ): Promise<Response> {
    const paramsSchema = Joi.object({
      id: Joi.number().integer(),
    }).required();

    const bodySchema = Joi.object({
      title: Joi.string(),
      status: Joi.string().valid('pending', 'in progress', 'done'),
      description: Joi.string(),
    }).required();

    try {
      req.params = await paramsSchema.validateAsync(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.body = await bodySchema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return next();
    } catch (err) {
      return res.status(422).json(err);
    }
  }
}
