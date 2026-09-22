import jwt from 'jsonwebtoken';
import { entorno } from '../config/entorno.js';
import { ErrorApi } from './error.middleware.js';

export function middlewareAutenticacion(req, res, next) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    return next(new ErrorApi('Token no proporcionado', 401));
  }

  const token = encabezado.split(' ')[1];

  try {
    const payload = jwt.verify(token, entorno.jwtSecret);
    req.auth = payload;
    next();
  } catch {
    next(new ErrorApi('Token invalido o expirado', 401));
  }
}
