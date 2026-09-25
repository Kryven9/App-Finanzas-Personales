import { metasServicio } from './metas.servicio.js';

export const metasControlador = {
  async listar(req, res, next) {
    try {
      const metas = await metasServicio.listar(req.auth.idUsuario);
      res.json(metas);
    } catch (error) {
      next(error);
    }
  },

  async obtener(req, res, next) {
    try {
      const meta = await metasServicio.obtenerPorId(req.auth.idUsuario, req.params.id);
      res.json(meta);
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const meta = await metasServicio.crear(req.auth.idUsuario, req.body);
      res.status(201).json(meta);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const meta = await metasServicio.actualizar(req.auth.idUsuario, req.params.id, req.body);
      res.json(meta);
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await metasServicio.eliminar(req.auth.idUsuario, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async listarAportes(req, res, next) {
    try {
      const aportes = await metasServicio.listarAportes(req.auth.idUsuario, req.params.idMeta);
      res.json(aportes);
    } catch (error) {
      next(error);
    }
  },

  async crearAporte(req, res, next) {
    try {
      const resultado = await metasServicio.crearAporte(
        req.auth.idUsuario,
        req.params.idMeta,
        req.body,
      );
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async eliminarAporte(req, res, next) {
    try {
      await metasServicio.eliminarAporte(
        req.auth.idUsuario,
        req.params.idMeta,
        req.params.idAporte,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async actualizarAporte(req, res, next) {
    try {
      const resultado = await metasServicio.actualizarAporte(
        req.auth.idUsuario,
        req.params.idMeta,
        req.params.idAporte,
        req.body,
      );
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },
};
