import clientePrisma from '../../compartido/config/cliente-prisma.js';

export const cuentasRepositorio = {
  async listar(idUsuario) {
    const cuentas = await clientePrisma.cuenta.findMany({
      where: { idUsuario },
      orderBy: { fechaCreacion: 'asc' },
      include: { _count: { select: { transacciones: true, transaccionesRecurrentes: true } } },
    });
    return cuentas;
  },

  // findFirst con idUsuario -> nunca se accede a cuentas de otros usuarios
  async buscarPorId(idUsuario, id) {
    const cuenta = await clientePrisma.cuenta.findFirst({
      where: { id, idUsuario },
      include: { _count: { select: { transacciones: true, transaccionesRecurrentes: true } } },
    });
    return cuenta;
  },

  // validar la cuenta de origen
  async buscarCuenta(idUsuario, id) {
    const cuenta = await clientePrisma.cuenta.findFirst({ where: { id, idUsuario } });
    return cuenta;
  },

  async crear(idUsuario, datos) {
    const cuenta = await clientePrisma.cuenta.create({ data: { ...datos, idUsuario } });
    return cuenta;
  },

  async actualizar(id, datos) {
    const cuenta = await clientePrisma.cuenta.update({ where: { id }, data: datos });
    return cuenta;
  },

  async eliminar(id) {
    await clientePrisma.cuenta.delete({ where: { id } });
  },

  // suma de ingresos y gastos por cuenta para calcular el saldo actual
  async resumirTransacciones(idUsuario, idCuenta) {
    const filas = await clientePrisma.transaccion.groupBy({
      by: ['idCuenta', 'tipo'],
      where: idCuenta ? { idUsuario, idCuenta } : { idUsuario },
      _sum: { monto: true },
    });
    return filas;
  },
};
