import { Router } from 'express';
import { autenticacionRutas } from '../modulos/autenticacion/autenticacion.rutas.js';
import { cuentasRutas } from '../modulos/cuentas/cuentas.rutas.js';
import { categoriasRutas } from '../modulos/categorias/categorias.rutas.js';

export const router = Router();

router.use('/autenticacion', autenticacionRutas);
router.use('/cuentas', cuentasRutas);
router.use('/categorias', categoriasRutas);
