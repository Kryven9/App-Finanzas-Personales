import clientePrisma from '../../compartido/config/cliente-prisma.js';
import { construirPeriodo } from '../../compartido/utilidades/fechas.js';

const INCLUIR_CATEGORIA = { categoria: { select: { nombre: true, esPredefinida: true } } };

export const presupuestosRepositorio = {
  async listar(idUsuario, mes, anio) {
    const presupuestos = await clientePrisma.presupuesto.findMany({
      where: { idUsuario, mes, anio },
      include: INCLUIR_CATEGORIA,
      orderBy: { fechaCreacion: 'asc' },
    });
    return presupuestos;
  },

  async buscarPorId(idUsuario, id) {
    const presupuesto = await clientePrisma.presupuesto.findFirst({
      where: { id, idUsuario },
      include: INCLUIR_CATEGORIA,
    });
    return presupuesto;
  },

  // categorias propias o predefinidas pueden presupuestarse
  async buscarCategoria(idUsuario, id) {
    const categoria = await clientePrisma.categoria.findFirst({
      where: { id, OR: [{ esPredefinida: true }, { idUsuario }] },
    });
    return categoria;
  },

  async buscarDuplicado(idUsuario, idCategoria, mes, anio) {
    const presupuesto = await clientePrisma.presupuesto.findFirst({
      where: { idUsuario, idCategoria, mes, anio },
    });
    return presupuesto;
  },

  async crear(idUsuario, datos) {
    const presupuesto = await clientePrisma.presupuesto.create({
      data: { ...datos, idUsuario },
      include: INCLUIR_CATEGORIA,
    });
    return presupuesto;
  },

  async actualizar(id, datos) {
    const presupuesto = await clientePrisma.presupuesto.update({
      where: { id },
      data: datos,
      include: INCLUIR_CATEGORIA,
    });
    return presupuesto;
  },

  async eliminar(id) {
    await clientePrisma.presupuesto.delete({ where: { id } });
  },

  // gasto real del periodo por categoria: suma de las transacciones de tipo gasto
  async resumirGastos(idUsuario, mes, anio) {
    const { inicio, fin } = construirPeriodo(mes, anio);

    const filas = await clientePrisma.transaccion.groupBy({
      by: ['idCategoria'],
      where: { idUsuario, tipo: 'GASTO', fecha: { gte: inicio, lte: fin } },
      _sum: { monto: true },
    });
    return filas;
  },
};
