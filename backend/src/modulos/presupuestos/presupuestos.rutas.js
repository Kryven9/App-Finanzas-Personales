import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validar, validarQuery } from '../../compartido/middlewares/validacion.middleware.js';
import {
  esquemaCrearPresupuesto,
  esquemaActualizarPresupuesto,
  esquemaFiltrosPresupuesto,
} from './presupuestos.validacion.js';
import { presupuestosControlador } from './presupuestos.controlador.js';

export const presupuestosRutas = Router();

presupuestosRutas.use(middlewareAutenticacion);
presupuestosRutas.get('/', validarQuery(esquemaFiltrosPresupuesto), presupuestosControlador.listar);
presupuestosRutas.post('/', validar(esquemaCrearPresupuesto), presupuestosControlador.crear);
presupuestosRutas.put(
  '/:id',
  validar(esquemaActualizarPresupuesto),
  presupuestosControlador.actualizar,
);
presupuestosRutas.delete('/:id', presupuestosControlador.eliminar);
