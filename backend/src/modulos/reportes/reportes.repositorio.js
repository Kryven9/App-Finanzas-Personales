import clientePrisma from '../../compartido/config/cliente-prisma.js';

export const reportesRepositorio = {
  // gastos de un periodo con el nombre de su categoria -> gastos por categoria
  async listarGastos(idUsuario, rango) {
    const gastos = await clientePrisma.transaccion.findMany({
      where: {
        idUsuario,
        tipo: 'GASTO',
        fecha: { gte: rango.inicio, lte: rango.fin },
      },
      select: {
        monto: true,
        idCategoria: true,
        categoria: { select: { nombre: true } },
      },
    });
    return gastos;
  },

  // ingresos y gastos del rango con su fecha -> evolucion y flujo de caja
  async listarTransacciones(idUsuario, rango) {
    const transacciones = await clientePrisma.transaccion.findMany({
      where: {
        idUsuario,
        fecha: { gte: rango.inicio, lte: rango.fin },
      },
      select: {
        tipo: true,
        fecha: true,
        monto: true,
      },
      orderBy: { fecha: 'asc' },
    });
    return transacciones;
  },
};
