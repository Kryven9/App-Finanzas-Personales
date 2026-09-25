import clientePrisma from '../../compartido/config/cliente-prisma.js';
import { construirRango } from '../../compartido/utilidades/fechas.js';

const INCLUIR_RELACIONES = {
  cuenta: { select: { nombre: true } },
  categoria: { select: { nombre: true } },
  aporteMeta: { select: { idMeta: true } },
};

// construye el where a partir de los filtros del listado
function construirFiltros({ fechaDesde, fechaHasta, idCuenta, idCategoria, montoMin, montoMax }) {
  const filtros = {};

  const rango = construirRango({ inicio: fechaDesde, fin: fechaHasta });

  if (rango.inicio || rango.fin) {
    filtros.fecha = {};
    if (rango.inicio) filtros.fecha.gte = rango.inicio;
    if (rango.fin) filtros.fecha.lte = rango.fin;
  }

  if (idCuenta) filtros.idCuenta = idCuenta;
  if (idCategoria) filtros.idCategoria = idCategoria;

  if (montoMin != null || montoMax != null) {
    filtros.monto = {};
    if (montoMin != null) filtros.monto.gte = montoMin;
    if (montoMax != null) filtros.monto.lte = montoMax;
  }

  return filtros;
}

export const transaccionesRepositorio = {
  // paginacion -> desde el id de la ultima transaccion de la pagina anterior;
  // se trae limite + 1 para saber si existe una pagina siguiente
  async listar(idUsuario, filtros, despuesDe, limite) {
    const where = { idUsuario, ...construirFiltros(filtros) };

    const transacciones = await clientePrisma.transaccion.findMany({
      where,
      include: INCLUIR_RELACIONES,
      orderBy: [{ fecha: 'desc' }, { fechaCreacion: 'desc' }],
      cursor: despuesDe ? { id: despuesDe } : undefined,
      skip: despuesDe ? 1 : 0,
      take: limite + 1,
    });

    return { transacciones };
  },

  async buscarPorId(idUsuario, id) {
    const transaccion = await clientePrisma.transaccion.findFirst({
      where: { id, idUsuario },
      include: INCLUIR_RELACIONES,
    });
    return transaccion;
  },

  // solo cuentas propias pueden recibir transacciones
  async buscarCuenta(idUsuario, id) {
    const cuenta = await clientePrisma.cuenta.findFirst({ where: { id, idUsuario } });
    return cuenta;
  },

  // categorias propias o predefinidas pueden asignarse a transacciones
  async buscarCategoria(idUsuario, id) {
    const categoria = await clientePrisma.categoria.findFirst({
      where: { id, OR: [{ esPredefinida: true }, { idUsuario }] },
    });
    return categoria;
  },

  async crear(idUsuario, datos) {
    const transaccion = await clientePrisma.transaccion.create({
      data: { ...datos, idUsuario },
      include: INCLUIR_RELACIONES,
    });
    return transaccion;
  },

  async actualizar(id, datos) {
    const transaccion = await clientePrisma.transaccion.update({
      where: { id },
      data: datos,
      include: INCLUIR_RELACIONES,
    });
    return transaccion;
  },

  async eliminar(id) {
    await clientePrisma.transaccion.delete({ where: { id } });
  },
};
