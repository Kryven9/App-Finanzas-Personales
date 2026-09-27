import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validarQuery } from '../../compartido/middlewares/validacion.middleware.js';
import { esquemaGastosPorCategoria, esquemaEvolucion } from './reportes.validacion.js';
import { reportesControlador } from './reportes.controlador.js';

export const reportesRutas = Router();

reportesRutas.use(middlewareAutenticacion);
reportesRutas.get(
  '/gastos-por-categoria',
  validarQuery(esquemaGastosPorCategoria),
  reportesControlador.gastosPorCategoria,
);
reportesRutas.get('/evolucion', validarQuery(esquemaEvolucion), reportesControlador.evolucion);
