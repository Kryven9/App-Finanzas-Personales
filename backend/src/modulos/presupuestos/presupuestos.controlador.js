import { presupuestosServicio } from './presupuestos.servicio.js';

export const presupuestosControlador = {
  async listar(req, res, next) {
    try {
      const presupuestos = await presupuestosServicio.listar(req.auth.idUsuario, req.consulta);
      res.json(presupuestos);
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const presupuesto = await presupuestosServicio.crear(req.auth.idUsuario, req.body);
      res.status(201).json(presupuesto);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const presupuesto = await presupuestosServicio.actualizar(
        req.auth.idUsuario,
        req.params.id,
        req.body,
      );
      res.json(presupuesto);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await presupuestosServicio.eliminar(req.auth.idUsuario, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
