import jwt from 'jsonwebtoken';
import { entorno } from '../config/entorno.js';

export function generarToken(idUsuario) {
  return jwt.sign({ idUsuario }, entorno.jwtSecret, { expiresIn: '7d' });
}
