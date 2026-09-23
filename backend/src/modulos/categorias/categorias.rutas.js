import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validar } from '../../compartido/middlewares/validacion.middleware.js';
import { esquemaCategoria } from './categorias.validacion.js';
import { categoriasControlador } from './categorias.controlador.js';

export const categoriasRutas = Router();

categoriasRutas.use(middlewareAutenticacion);
categoriasRutas.get('/', categoriasControlador.listar);
categoriasRutas.post('/', validar(esquemaCategoria), categoriasControlador.crear);
categoriasRutas.put('/:id', validar(esquemaCategoria), categoriasControlador.actualizar);
categoriasRutas.delete('/:id', categoriasControlador.eliminar);
