import express from 'express';
import cors from 'cors';
import { middlewareError } from './compartido/middlewares/error.middleware.js';
import { router } from './rutas/index.js';

const app = express();

app.use(cors());
app.use(express.json());

//rutas

app.use('/api', router);
app.use(middlewareError);

export default app;
