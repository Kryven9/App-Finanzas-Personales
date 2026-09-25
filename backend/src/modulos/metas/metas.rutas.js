import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validar } from '../../compartido/middlewares/validacion.middleware.js';
import { esquemaMeta, esquemaAporte } from './metas.validacion.js';
import { metasControlador } from './metas.controlador.js';

export const metasRutas = Router();

metasRutas.use(middlewareAutenticacion);
metasRutas.get('/', metasControlador.listar);
metasRutas.get('/:id', metasControlador.obtener);
metasRutas.post('/', validar(esquemaMeta), metasControlador.crear);
metasRutas.put('/:id', validar(esquemaMeta), metasControlador.actualizar);
metasRutas.delete('/:id', metasControlador.eliminar);
metasRutas.get('/:idMeta/aportes', metasControlador.listarAportes);
metasRutas.post('/:idMeta/aportes', validar(esquemaAporte), metasControlador.crearAporte);
metasRutas.put(
  '/:idMeta/aportes/:idAporte',
  validar(esquemaAporte),
  metasControlador.actualizarAporte,
);
metasRutas.delete('/:idMeta/aportes/:idAporte', metasControlador.eliminarAporte);
