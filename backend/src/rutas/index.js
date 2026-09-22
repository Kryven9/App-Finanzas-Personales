import { Router } from 'express';
import { autenticacionRutas } from '../modulos/autenticacion/autenticacion.rutas.js';

export const router = Router();

router.use('/autenticacion', autenticacionRutas);
