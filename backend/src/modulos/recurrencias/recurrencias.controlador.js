import { recurrenciasServicio } from './recurrencias.servicio.js';

export const recurrenciasControlador = {
  async listar(req, res, next) {
    try {
      const reglas = await recurrenciasServicio.listar(req.auth.idUsuario);
      res.json(reglas);
    } catch (error) {
      next(error);
    }
  },

  async obtener(req, res, next) {
    try {
      const regla = await recurrenciasServicio.obtenerPorId(req.auth.idUsuario, req.params.id);
      res.json(regla);
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const regla = await recurrenciasServicio.crear(req.auth.idUsuario, req.body);
      res.status(201).json(regla);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const regla = await recurrenciasServicio.actualizar(
        req.auth.idUsuario,
        req.params.id,
        req.body,
      );
      res.json(regla);
    } catch (error) {
      next(error);
    }
  },

  async cambiarEstado(req, res, next) {
    try {
      const regla = await recurrenciasServicio.cambiarEstado(
        req.auth.idUsuario,
        req.params.id,
        req.body.activa,
      );
      res.json(regla);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await recurrenciasServicio.eliminar(
        req.auth.idUsuario,
        req.params.id,
        req.consulta.eliminarGeneradas,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
