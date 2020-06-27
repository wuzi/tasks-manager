import express from 'express';

import TaskController from '../controllers/task.controller';
import TaskValidator from '../validators/task.validator';

const router = express.Router();

router
  .route('/')
  .get(TaskValidator.findAll, TaskController.findAll);

router
  .route('/:id')
  .get(TaskValidator.findById, TaskController.findById);

router
  .route('/')
  .post(TaskValidator.store, TaskController.store);

export default router;
