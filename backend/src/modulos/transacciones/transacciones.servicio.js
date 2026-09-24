import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { transaccionesRepositorio } from './transacciones.repositorio.js';

const LIMITE_PAGINA = 10;

// convierte montos Decimal a numero y aplana los nombres de las relaciones
function limpiarTransaccion(transaccion) {
  const { idUsuario: _idUsuario, cuenta, categoria, ...datos } = transaccion;
  return {
    ...datos,
    monto: Number(transaccion.monto),
    cuentaNombre: cuenta?.nombre ?? '',
    categoriaNombre: categoria?.nombre ?? '',
  };
}

// validar que la cuenta y la categoria existan y que el tipo coincida con la categoria
async function validarRelaciones(idUsuario, datos) {
  const cuenta = await transaccionesRepositorio.buscarCuenta(idUsuario, datos.idCuenta);

  if (!cuenta) {
    throw new ErrorApi('Cuenta no encontrada', 404);
  }

  const categoria = await transaccionesRepositorio.buscarCategoria(idUsuario, datos.idCategoria);

  if (!categoria) {
    throw new ErrorApi('Categoria no encontrada', 404);
  }

  if (categoria.tipo !== datos.tipo) {
    throw new ErrorApi(
      `La categoria "${categoria.nombre}" es de tipo ${categoria.tipo === 'INGRESO' ? 'ingreso' : 'gasto'} y no corresponde a una transaccion de tipo ${datos.tipo === 'INGRESO' ? 'ingreso' : 'gasto'}`,
      422,
    );
  }
}

export const transaccionesServicio = {
  async listar(idUsuario, filtros) {
    const { transacciones } = await transaccionesRepositorio.listar(
      idUsuario,
      filtros,
      filtros.despuesDe,
      LIMITE_PAGINA,
    );

    // si vino una transaccion de mas, hay pagina siguiente -> el cursor es el id de la ultima visible
    const haySiguiente = transacciones.length > LIMITE_PAGINA;
    const pagina = transacciones.slice(0, LIMITE_PAGINA);

    return {
      transacciones: pagina.map(limpiarTransaccion),
      cursorSiguiente: haySiguiente ? pagina[pagina.length - 1].id : null,
    };
  },

  async obtenerPorId(idUsuario, id) {
    const transaccion = await transaccionesRepositorio.buscarPorId(idUsuario, id);

    if (!transaccion) {
      throw new ErrorApi('Transaccion no encontrada', 404);
    }

    return limpiarTransaccion(transaccion);
  },

  async crear(idUsuario, datos) {
    await validarRelaciones(idUsuario, datos);
    const transaccion = await transaccionesRepositorio.crear(idUsuario, datos);
    return limpiarTransaccion(transaccion);
  },

  async actualizar(idUsuario, id, datos) {
    const transaccion = await transaccionesRepositorio.buscarPorId(idUsuario, id);

    if (!transaccion) {
      throw new ErrorApi('Transaccion no encontrada', 404);
    }

    // el tipo no es editable -> la nueva categoria debe coincidir con el tipo actual
    await validarRelaciones(idUsuario, { ...datos, tipo: transaccion.tipo });
    const actualizada = await transaccionesRepositorio.actualizar(id, datos);
    return limpiarTransaccion(actualizada);
  },

  async eliminar(idUsuario, id) {
    const transaccion = await transaccionesRepositorio.buscarPorId(idUsuario, id);

    if (!transaccion) {
      throw new ErrorApi('Transaccion no encontrada', 404);
    }

    await transaccionesRepositorio.eliminar(id);
  },
};
