import express from 'express';
import TaskRoutes from './task.route';

const router = express.Router();

router.use('/tasks', TaskRoutes);

export default router;
