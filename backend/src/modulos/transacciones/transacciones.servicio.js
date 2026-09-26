import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { validarRelacionesTransaccion } from '../../compartido/servicios/validar-relaciones.js';
import { recurrenciasServicio } from '../recurrencias/recurrencias.servicio.js';
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
    esAporteMeta: Boolean(transaccion.aporteMeta),
    idMetaAporte: transaccion.aporteMeta?.idMeta ?? null,
  };
}

// las transacciones generadas por aportes de metas solo se administran desde el modulo de metas
function validarTransaccionManual(transaccion) {
  if (transaccion.aporteMeta) {
    throw new ErrorApi(
      'Esta transaccion fue generada por un aporte de meta y solo se puede modificar eliminando el aporte desde el modulo de metas',
      403,
    );
  }
}

export const transaccionesServicio = {
  async listar(idUsuario, filtros) {
    // antes de responder se generan los ciclos pendientes de las reglas recurrentes
    await recurrenciasServicio.generarPendientes(idUsuario);

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
    await validarRelacionesTransaccion(idUsuario, datos);
    const transaccion = await transaccionesRepositorio.crear(idUsuario, datos);
    return limpiarTransaccion(transaccion);
  },

  async actualizar(idUsuario, id, datos) {
    const transaccion = await transaccionesRepositorio.buscarPorId(idUsuario, id);

    if (!transaccion) {
      throw new ErrorApi('Transaccion no encontrada', 404);
    }

    await validarTransaccionManual(transaccion);
    // el tipo no es editable -> la nueva categoria debe coincidir con el tipo actual
    await validarRelacionesTransaccion(idUsuario, { ...datos, tipo: transaccion.tipo });
    const actualizada = await transaccionesRepositorio.actualizar(id, datos);
    return limpiarTransaccion(actualizada);
  },

  async eliminar(idUsuario, id) {
    const transaccion = await transaccionesRepositorio.buscarPorId(idUsuario, id);

    if (!transaccion) {
      throw new ErrorApi('Transaccion no encontrada', 404);
    }

    await validarTransaccionManual(transaccion);
    await transaccionesRepositorio.eliminar(id);
  },
};
