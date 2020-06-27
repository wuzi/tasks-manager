import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import routes from './routes';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use('/v1', routes);

export default app;
