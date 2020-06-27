import { createConnection } from 'typeorm';
import app from './app';
import dbConfig from './config/database';
import logger from './utils/logger';

createConnection(dbConfig).then(() => {
  app.listen(app.get('port'), () => {
    logger('database', `App is running at http://localhost:${app.get('port')}`, 'info');
  });
}).catch((err) => {
  logger('database', 'It was not possible to connect to the database', 'error');
  logger('database', err.message, 'error');
});
