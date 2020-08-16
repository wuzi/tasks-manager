import { createConnection } from 'typeorm';
import { App } from './app';
import dbConfig from './config/database';
import logger from './utils/logger';

createConnection(dbConfig).then(() => {
  const app = new App();
  app.start(parseInt(process.env.PORT as string, 10) || 3000);
}).catch((err) => {
  logger('database', 'It was not possible to connect to the database', 'error');
  logger('database', err.message, 'error');
});
