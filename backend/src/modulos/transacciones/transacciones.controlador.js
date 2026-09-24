import { transaccionesServicio } from './transacciones.servicio.js';

export const transaccionesControlador = {
  async listar(req, res, next) {
    try {
      const datos = await transaccionesServicio.listar(req.auth.idUsuario, req.consulta);
      res.json(datos);
    } catch (error) {
      next(error);
    }
  },

  async obtener(req, res, next) {
    try {
      const transaccion = await transaccionesServicio.obtenerPorId(
        req.auth.idUsuario,
        req.params.id,
      );
      res.json(transaccion);
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const transaccion = await transaccionesServicio.crear(req.auth.idUsuario, req.body);
      res.status(201).json(transaccion);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const transaccion = await transaccionesServicio.actualizar(
        req.auth.idUsuario,
        req.params.id,
        req.body,
      );
      res.json(transaccion);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await transaccionesServicio.eliminar(req.auth.idUsuario, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
