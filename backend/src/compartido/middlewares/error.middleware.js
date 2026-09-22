export class ErrorApi extends Error {
  constructor(mensaje, codigoEstado = 400) {
    super(mensaje);
    this.codigoEstado = codigoEstado;
  }
}

export function middlewareError(error, _req, res, _next) {
  console.error(error);

  if (error instanceof ErrorApi) {
    return res.status(error.codigoEstado).json({ error: error.message });
  }

  return res.status(500).json({ error: 'Error interno del servidor' });
}
