import { categoriasServicio } from './categorias.servicio.js';

export const categoriasControlador = {
  async listar(req, res, next) {
    try {
      const categorias = await categoriasServicio.listar(req.auth.idUsuario);
      res.json(categorias);
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const categoria = await categoriasServicio.crear(req.auth.idUsuario, req.body);
      res.status(201).json(categoria);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const categoria = await categoriasServicio.actualizar(
        req.auth.idUsuario,
        req.params.id,
        req.body,
      );
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await categoriasServicio.eliminar(req.auth.idUsuario, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
