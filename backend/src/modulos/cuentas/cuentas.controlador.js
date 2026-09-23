import { cuentasServicio } from './cuentas.servicio.js';

export const cuentasControlador = {
  async listar(req, res, next) {
    try {
      const datos = await cuentasServicio.listar(req.auth.idUsuario);
      res.json(datos);
    } catch (error) {
      next(error);
    }
  },

  async obtener(req, res, next) {
    try {
      const cuenta = await cuentasServicio.obtenerPorId(req.auth.idUsuario, req.params.id);
      res.json(cuenta);
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const cuenta = await cuentasServicio.crear(req.auth.idUsuario, req.body);
      res.status(201).json(cuenta);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const cuenta = await cuentasServicio.actualizar(req.auth.idUsuario, req.params.id, req.body);
      res.json(cuenta);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await cuentasServicio.eliminar(req.auth.idUsuario, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
