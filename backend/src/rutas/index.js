import { Router } from 'express';
import { autenticacionRutas } from '../modulos/autenticacion/autenticacion.rutas.js';
import { cuentasRutas } from '../modulos/cuentas/cuentas.rutas.js';
import { categoriasRutas } from '../modulos/categorias/categorias.rutas.js';
import { transaccionesRutas } from '../modulos/transacciones/transacciones.rutas.js';
import { presupuestosRutas } from '../modulos/presupuestos/presupuestos.rutas.js';

export const router = Router();

router.use('/autenticacion', autenticacionRutas);
router.use('/cuentas', cuentasRutas);
router.use('/categorias', categoriasRutas);
router.use('/transacciones', transaccionesRutas);
router.use('/presupuestos', presupuestosRutas);
