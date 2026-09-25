import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { categoriasRepositorio } from '../categorias/categorias.repositorio.js';
import { presupuestosRepositorio } from './presupuestos.repositorio.js';

// convierte el monto Decimal a numero y aplana los datos de la categoria
function limpiarPresupuesto(presupuesto) {
  const { idUsuario: _idUsuario, categoria, ...datos } = presupuesto;
  return {
    ...datos,
    montoLimite: Number(presupuesto.montoLimite),
    categoriaNombre: categoria?.nombre ?? '',
    esPredefinida: categoria?.esPredefinida ?? false,
  };
}

// solo las categorias de tipo gasto se pueden presupuestar -> el gasto real no aplica a ingresos
async function validarCategoria(idUsuario, idCategoria) {
  const categoria = await categoriasRepositorio.buscarCategoria(idUsuario, idCategoria);

  if (!categoria) {
    throw new ErrorApi('Categoria no encontrada', 404);
  }

  if (categoria.tipo !== 'GASTO') {
    throw new ErrorApi('Solo se pueden presupuestar categorias de tipo gasto', 422);
  }
}

export const presupuestosServicio = {
  async listar(idUsuario, { mes, anio }) {
    const [presupuestos, gastos] = await Promise.all([
      presupuestosRepositorio.listar(idUsuario, mes, anio),
      presupuestosRepositorio.resumirGastos(idUsuario, mes, anio),
    ]);

    // gasto real del periodo por categoria, para comparar contra el limite
    const gastoPorCategoria = new Map(
      gastos.map((fila) => [fila.idCategoria, Number(fila._sum.monto ?? 0)]),
    );

    return presupuestos.map((presupuesto) => {
      const datos = limpiarPresupuesto(presupuesto);
      return { ...datos, gastoReal: gastoPorCategoria.get(presupuesto.idCategoria) ?? 0 };
    });
  },

  async crear(idUsuario, datos) {
    await validarCategoria(idUsuario, datos.idCategoria);

    const duplicado = await presupuestosRepositorio.buscarDuplicado(
      idUsuario,
      datos.idCategoria,
      datos.mes,
      datos.anio,
    );

    if (duplicado) {
      throw new ErrorApi(
        'Ya existe un presupuesto para esa categoria en el periodo seleccionado',
        409,
      );
    }

    const presupuesto = await presupuestosRepositorio.crear(idUsuario, datos);
    return limpiarPresupuesto(presupuesto);
  },

  async actualizar(idUsuario, id, { montoLimite }) {
    const presupuesto = await presupuestosRepositorio.buscarPorId(idUsuario, id);

    if (!presupuesto) {
      throw new ErrorApi('Presupuesto no encontrado', 404);
    }

    const actualizado = await presupuestosRepositorio.actualizar(id, { montoLimite });
    return limpiarPresupuesto(actualizado);
  },

  async eliminar(idUsuario, id) {
    const presupuesto = await presupuestosRepositorio.buscarPorId(idUsuario, id);

    if (!presupuesto) {
      throw new ErrorApi('Presupuesto no encontrado', 404);
    }

    await presupuestosRepositorio.eliminar(id);
  },
};
