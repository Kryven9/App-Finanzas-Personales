import clientePrisma from '../../compartido/config/cliente-prisma.js';

const INCLUIR_CUENTA = { cuenta: { select: { nombre: true } } };

export const metasRepositorio = {
  async listar(idUsuario) {
    const metas = await clientePrisma.metaAhorro.findMany({
      where: { idUsuario },
      orderBy: { fechaCreacion: 'desc' },
    });
    return metas;
  },

  async buscarPorId(idUsuario, id) {
    const meta = await clientePrisma.metaAhorro.findFirst({
      where: { id, idUsuario },
    });
    return meta;
  },

  async crear(idUsuario, datos) {
    const meta = await clientePrisma.metaAhorro.create({ data: { ...datos, idUsuario } });
    return meta;
  },

  async actualizar(id, datos) {
    const meta = await clientePrisma.metaAhorro.update({ where: { id }, data: datos });
    return meta;
  },

  // solo cuentas propias pueden recibir aportes
  async buscarCuenta(idUsuario, id) {
    const cuenta = await clientePrisma.cuenta.findFirst({ where: { id, idUsuario } });
    return cuenta;
  },

  async buscarCategoriaSistema() {
    const categoria = await clientePrisma.categoria.findFirst({ where: { esSistema: true } });
    return categoria;
  },

  async buscarAporte(idAporte) {
    const aporte = await clientePrisma.aporteMeta.findUnique({
      where: { id: idAporte },
      include: { meta: true },
    });
    return aporte;
  },

  async listarAportes(idMeta) {
    const aportes = await clientePrisma.aporteMeta.findMany({
      where: { idMeta },
      include: INCLUIR_CUENTA,
      orderBy: [{ fecha: 'desc' }, { fechaCreacion: 'desc' }],
    });
    return aportes;
  },

  // crea el aporte, su transaccion de gasto y actualiza el monto acumulado en una sola operacion
  async crearAporteConTransaccion({ meta, cuenta, categoria, monto, fecha }) {
    return clientePrisma.$transaction(async (tx) => {
      const transaccion = await tx.transaccion.create({
        data: {
          idUsuario: meta.idUsuario,
          idCuenta: cuenta.id,
          idCategoria: categoria.id,
          tipo: 'GASTO',
          monto,
          fecha,
          descripcion: `Aporte a la meta "${meta.nombre}"`,
        },
      });

      const aporte = await tx.aporteMeta.create({
        data: {
          idMeta: meta.id,
          idCuenta: cuenta.id,
          idTransaccion: transaccion.id,
          monto,
          fecha,
        },
        include: INCLUIR_CUENTA,
      });

      const metaActualizada = await tx.metaAhorro.update({
        where: { id: meta.id },
        data: { montoActual: { increment: monto } },
      });

      return { transaccion, aporte, metaActualizada };
    });
  },

  // elimina el aporte y su transaccion vinculada, revirtiendo el monto acumulado de la meta
  async eliminarAporteConTransaccion(aporte) {
    return clientePrisma.$transaction(async (tx) => {
      await tx.aporteMeta.delete({ where: { id: aporte.id } });
      await tx.transaccion.delete({ where: { id: aporte.idTransaccion } });
      const metaActualizada = await tx.metaAhorro.update({
        where: { id: aporte.idMeta },
        data: { montoActual: { decrement: aporte.monto } },
      });
      return metaActualizada;
    });
  },

  // actualiza el aporte y su transaccion vinculada (monto, fecha y cuenta) en una sola operacion,
  // ajustando el monto acumulado por la diferencia entre el monto anterior y el nuevo
  async actualizarAporteConTransaccion(aporte, datos) {
    return clientePrisma.$transaction(async (tx) => {
      const { monto, fecha, idCuenta } = datos;

      await tx.transaccion.update({
        where: { id: aporte.idTransaccion },
        data: { monto, fecha, idCuenta },
      });

      const aporteActualizado = await tx.aporteMeta.update({
        where: { id: aporte.id },
        data: { monto, fecha, idCuenta },
        include: INCLUIR_CUENTA,
      });

      const metaActualizada = await tx.metaAhorro.update({
        where: { id: aporte.idMeta },
        data: { montoActual: { increment: monto - Number(aporte.monto) } },
      });

      return { aporte: aporteActualizado, metaActualizada };
    });
  },

  // elimina la meta con sus aportes y las transacciones que estos generaron
  async eliminarMetaConAportes(meta) {
    return clientePrisma.$transaction(async (tx) => {
      const aportes = await tx.aporteMeta.findMany({ where: { idMeta: meta.id } });
      const idsTransacciones = aportes.map((aporte) => aporte.idTransaccion);

      await tx.aporteMeta.deleteMany({ where: { idMeta: meta.id } });

      if (idsTransacciones.length > 0) {
        await tx.transaccion.deleteMany({ where: { id: { in: idsTransacciones } } });
      }

      await tx.metaAhorro.delete({ where: { id: meta.id } });
    });
  },
};
