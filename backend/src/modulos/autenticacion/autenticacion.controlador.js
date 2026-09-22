import { autenticacionServicio } from './autenticacion.servicio.js';

export const autenticacionControlador = {
  async registro(req, res, next) {
    try {
      const resultado = await autenticacionServicio.registrar(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async iniciarSesion(req, res, next) {
    try {
      const resultado = await autenticacionServicio.iniciarSesion(req.body);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async perfil(req, res, next) {
    try {
      const usuario = await autenticacionServicio.obtenerPerfil(req.auth.idUsuario);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  },

  async actualizarPerfil(req, res, next) {
    try {
      const usuario = await autenticacionServicio.actualizarPerfil(req.auth.idUsuario, req.body);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  },

  async cambiarContrasena(req, res, next) {
    try {
      const resultado = await autenticacionServicio.cambiarContrasena(req.auth.idUsuario, req.body);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },
};
