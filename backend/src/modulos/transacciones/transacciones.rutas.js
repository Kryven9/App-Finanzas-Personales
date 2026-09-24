import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validar, validarQuery } from '../../compartido/middlewares/validacion.middleware.js';
import {
  esquemaCrearTransaccion,
  esquemaActualizarTransaccion,
  esquemaFiltrosTransaccion,
} from './transacciones.validacion.js';
import { transaccionesControlador } from './transacciones.controlador.js';

export const transaccionesRutas = Router();

transaccionesRutas.use(middlewareAutenticacion);
transaccionesRutas.get(
  '/',
  validarQuery(esquemaFiltrosTransaccion),
  transaccionesControlador.listar,
);
transaccionesRutas.get('/:id', transaccionesControlador.obtener);
transaccionesRutas.post('/', validar(esquemaCrearTransaccion), transaccionesControlador.crear);
transaccionesRutas.put(
  '/:id',
  validar(esquemaActualizarTransaccion),
  transaccionesControlador.actualizar,
);
transaccionesRutas.delete('/:id', transaccionesControlador.eliminar);
