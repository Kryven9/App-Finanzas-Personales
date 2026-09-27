import { reportesServicio } from './reportes.servicio.js';

export const reportesControlador = {
  async gastosPorCategoria(req, res, next) {
    try {
      const gastos = await reportesServicio.gastosPorCategoria(req.auth.idUsuario, req.consulta);
      res.json(gastos);
    } catch (error) {
      next(error);
    }
  },

  async evolucion(req, res, next) {
    try {
      const evolucion = await reportesServicio.evolucion(req.auth.idUsuario, req.consulta);
      res.json(evolucion);
    } catch (error) {
      next(error);
    }
  },
};
