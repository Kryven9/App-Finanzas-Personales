import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validar } from '../../compartido/middlewares/validacion.middleware.js';
import { esquemaCuenta } from './cuentas.validacion.js';
import { cuentasControlador } from './cuentas.controlador.js';

export const cuentasRutas = Router();

cuentasRutas.use(middlewareAutenticacion);
cuentasRutas.get('/', cuentasControlador.listar);
cuentasRutas.get('/:id', cuentasControlador.obtener);
cuentasRutas.post('/', validar(esquemaCuenta), cuentasControlador.crear);
cuentasRutas.put('/:id', validar(esquemaCuenta), cuentasControlador.actualizar);
cuentasRutas.delete('/:id', cuentasControlador.eliminar);
