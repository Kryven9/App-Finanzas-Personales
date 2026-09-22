import { ErrorApi } from './error.middleware.js';

export function validar(schema) {
  return (req, _res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const mensaje = resultado.error.issues.map((problema) => problema.message).join(', ');
      return next(new ErrorApi(mensaje, 422));
    }

    req.body = resultado.data;
    next();
  };
}

export function validarQuery(schema) {
  return (req, _res, next) => {
    const resultado = schema.safeParse(req.query);

    if (!resultado.success) {
      const mensaje = resultado.error.issues.map((problema) => problema.message).join(', ');
      return next(new ErrorApi(mensaje, 422));
    }

    req.consulta = resultado.data;
    next();
  };
}
