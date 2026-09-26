import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validar, validarQuery } from '../../compartido/middlewares/validacion.middleware.js';
import {
  esquemaCrearRecurrencia,
  esquemaActualizarRecurrencia,
  esquemaEstadoRecurrencia,
  esquemaEliminarRecurrencia,
} from './recurrencias.validacion.js';
import { recurrenciasControlador } from './recurrencias.controlador.js';

export const recurrenciasRutas = Router();

recurrenciasRutas.use(middlewareAutenticacion);
recurrenciasRutas.get('/', recurrenciasControlador.listar);
recurrenciasRutas.get('/:id', recurrenciasControlador.obtener);
recurrenciasRutas.post('/', validar(esquemaCrearRecurrencia), recurrenciasControlador.crear);
recurrenciasRutas.put(
  '/:id',
  validar(esquemaActualizarRecurrencia),
  recurrenciasControlador.actualizar,
);
recurrenciasRutas.put(
  '/:id/estado',
  validar(esquemaEstadoRecurrencia),
  recurrenciasControlador.cambiarEstado,
);
recurrenciasRutas.delete(
  '/:id',
  validarQuery(esquemaEliminarRecurrencia),
  recurrenciasControlador.eliminar,
);
