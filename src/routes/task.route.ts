import express from 'express';
import TaskController from '../controllers/task.controller';

const router = express.Router();

router
  .route('/')
  .get(TaskController.findAll);

export default router;
