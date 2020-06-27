import { createConnection } from 'typeorm';
import app from './app';
import dbConfig from './config/database';

createConnection(dbConfig).then(() => {
  app.listen(app.get('port'), () => {
    console.log(`App is running at http://localhost:${app.get('port')}`);
  });
}).catch((err) => {
  console.log(`${err}`);
});
