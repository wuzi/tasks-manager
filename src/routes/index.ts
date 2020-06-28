import express from 'express';
import TaskRoutes from './task.route';
import HealthRoutes from './health.route';

const router = express.Router();

router.use('/tasks', TaskRoutes);
router.use('/health', HealthRoutes);

export default router;
