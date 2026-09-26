import clientePrisma from '../../compartido/config/cliente-prisma.js';

const INCLUIR_RELACIONES = {
  cuenta: { select: { nombre: true } },
  categoria: { select: { nombre: true } },
  _count: { select: { transacciones: true } },
};

export const recurrenciasRepositorio = {
  async listar(idUsuario) {
    const reglas = await clientePrisma.transaccionRecurrente.findMany({
      where: { idUsuario },
      include: INCLUIR_RELACIONES,
      orderBy: [{ activa: 'desc' }, { proximaFechaGeneracion: 'asc' }, { fechaCreacion: 'desc' }],
    });
    return reglas;
  },

  async buscarPorId(idUsuario, id) {
    const regla = await clientePrisma.transaccionRecurrente.findFirst({
      where: { id, idUsuario },
      include: INCLUIR_RELACIONES,
    });
    return regla;
  },

  // reglas activas cuya proxima fecha ya vencio -> pendientes de generar
  async listarPendientes(idUsuario) {
    const reglas = await clientePrisma.transaccionRecurrente.findMany({
      where: { idUsuario, activa: true, proximaFechaGeneracion: { lte: new Date() } },
    });
    return reglas;
  },

  async crear(idUsuario, datos) {
    const regla = await clientePrisma.transaccionRecurrente.create({
      data: { ...datos, idUsuario },
      include: INCLUIR_RELACIONES,
    });
    return regla;
  },

  async actualizar(id, datos) {
    const regla = await clientePrisma.transaccionRecurrente.update({
      where: { id },
      data: datos,
      include: INCLUIR_RELACIONES,
    });
    return regla;
  },

  async eliminar(id) {
    await clientePrisma.transaccionRecurrente.delete({ where: { id } });
  },

  // las transacciones generadas se conservan como independientes;
  // solo se borran si el usuario lo pide explicitamente
  async eliminarTransaccionesGeneradas(id) {
    await clientePrisma.transaccion.deleteMany({ where: { idTransaccionRecurrente: id } });
  },

  // crea las transacciones de los ciclos vencidos y adelanta la proxima fecha en una sola operacion;
  // el updateMany condicionado a la fecha leida hace que solo una peticion concurrente reclame la regla
  // (si otra ya la adelanto, count = 0 y no genera nada), y la unique [idTransaccionRecurrente, fecha]
  // de la db es la seguridad final
  async generarCiclos(regla, fechasCiclos, proximaFecha) {
    return clientePrisma.$transaction(async (tx) => {
      const reclamo = await tx.transaccionRecurrente.updateMany({
        where: {
          id: regla.id,
          activa: true,
          proximaFechaGeneracion: regla.proximaFechaGeneracion,
        },
        data: { proximaFechaGeneracion: proximaFecha },
      });

      if (reclamo.count === 0) {
        return 0;
      }

      for (const fecha of fechasCiclos) {
        await tx.transaccion.create({
          data: {
            idUsuario: regla.idUsuario,
            idCuenta: regla.idCuenta,
            idCategoria: regla.idCategoria,
            tipo: regla.tipo,
            monto: regla.monto,
            descripcion: regla.descripcion,
            fecha,
            idTransaccionRecurrente: regla.id,
          },
        });
      }

      return fechasCiclos.length;
    });
  },
};
