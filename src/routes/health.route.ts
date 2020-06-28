import express from 'express';

import HealthController from '../controllers/health.controller';

const router = express.Router();

router
  .route('/')
  .get(HealthController.check);

export default router;
