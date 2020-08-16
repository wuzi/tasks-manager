import 'dotenv/config';
import 'reflect-metadata';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger';
import controllers from './controllers';
import logger from './utils/logger';

export class App extends Server {
  constructor() {
    super(process.env.NODE_ENV === 'development');
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
    this.setupControllers();
  }

  private setupControllers(): void {
    super.addControllers(controllers);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      logger('database', `App is running at http://localhost:${port}`, 'info');
    });
  }
}
