import { container } from 'tsyringe';
import TaskService from '../services/task.service';
import { HealthController } from './health.controller';
import { TaskController } from './task.controller';

export default [
  new HealthController(),
  new TaskController(container.resolve(TaskService)),
];
