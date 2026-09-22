import { Router } from 'express';
import { middlewareAutenticacion } from '../../compartido/middlewares/autenticacion.middleware.js';
import { validar } from '../../compartido/middlewares/validacion.middleware.js';
import {
  esquemaRegistro,
  esquemaIniciarSesion,
  esquemaActualizarPerfil,
  esquemaCambioContrasena,
} from './autenticacion.validacion.js';
import { autenticacionControlador } from './autenticacion.controlador.js';

export const autenticacionRutas = Router();

// rutas publicas
autenticacionRutas.post('/registro', validar(esquemaRegistro), autenticacionControlador.registro);
autenticacionRutas.post(
  '/iniciar-sesion',
  validar(esquemaIniciarSesion),
  autenticacionControlador.iniciarSesion,
);

// rutas protegidas
autenticacionRutas.use(middlewareAutenticacion);
autenticacionRutas.get('/perfil', autenticacionControlador.perfil);
autenticacionRutas.put(
  '/perfil',
  validar(esquemaActualizarPerfil),
  autenticacionControlador.actualizarPerfil,
);
autenticacionRutas.put(
  '/perfil/contrasena',
  validar(esquemaCambioContrasena),
  autenticacionControlador.cambiarContrasena,
);
