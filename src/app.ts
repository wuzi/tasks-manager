import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import swaggerOptions from './config/swagger';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use('/v1', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default app;
