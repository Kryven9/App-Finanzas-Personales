import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { categoriasRepositorio } from '../categorias/categorias.repositorio.js';
import { cuentasRepositorio } from '../cuentas/cuentas.repositorio.js';
import { metasRepositorio } from './metas.repositorio.js';

// convierte los montos Decimal a numero y aplana el nombre de la cuenta
function limpiarMeta(meta) {
  const { idUsuario: _idUsuario, ...datos } = meta;
  return {
    ...datos,
    montoObjetivo: Number(meta.montoObjetivo),
    montoActual: Number(meta.montoActual),
  };
}

function limpiarAporte(aporte) {
  const { cuenta, ...datos } = aporte;
  return { ...datos, monto: Number(aporte.monto), cuentaNombre: cuenta?.nombre ?? '' };
}

export const metasServicio = {
  async listar(idUsuario) {
    const metas = await metasRepositorio.listar(idUsuario);
    return metas.map(limpiarMeta);
  },

  async obtenerPorId(idUsuario, id) {
    const meta = await metasRepositorio.buscarPorId(idUsuario, id);

    if (!meta) {
      throw new ErrorApi('Meta no encontrada', 404);
    }

    return limpiarMeta(meta);
  },

  async crear(idUsuario, datos) {
    const meta = await metasRepositorio.crear(idUsuario, datos);
    return limpiarMeta(meta);
  },

  async actualizar(idUsuario, id, datos) {
    const meta = await metasRepositorio.buscarPorId(idUsuario, id);

    if (!meta) {
      throw new ErrorApi('Meta no encontrada', 404);
    }

    const actualizada = await metasRepositorio.actualizar(id, datos);
    return limpiarMeta(actualizada);
  },

  async eliminar(idUsuario, id) {
    const meta = await metasRepositorio.buscarPorId(idUsuario, id);

    if (!meta) {
      throw new ErrorApi('Meta no encontrada', 404);
    }

    // la eliminacion en cascada tambien revierte las transacciones generadas por sus aportes
    await metasRepositorio.eliminarMetaConAportes(meta);
  },

  async listarAportes(idUsuario, idMeta) {
    const meta = await metasRepositorio.buscarPorId(idUsuario, idMeta);

    if (!meta) {
      throw new ErrorApi('Meta no encontrada', 404);
    }

    const aportes = await metasRepositorio.listarAportes(idMeta);
    return aportes.map(limpiarAporte);
  },

  async crearAporte(idUsuario, idMeta, { monto, fecha, idCuenta }) {
    const meta = await metasRepositorio.buscarPorId(idUsuario, idMeta);

    if (!meta) {
      throw new ErrorApi('Meta no encontrada', 404);
    }

    const cuenta = await cuentasRepositorio.buscarCuenta(idUsuario, idCuenta);

    if (!cuenta) {
      throw new ErrorApi('Cuenta no encontrada', 404);
    }

    const categoria = await categoriasRepositorio.buscarCategoriaSistema();

    if (!categoria) {
      throw new ErrorApi('La categoria de sistema para aportes no esta configurada', 500);
    }

    const { aporte, metaActualizada } = await metasRepositorio.crearAporteConTransaccion({
      meta,
      cuenta,
      categoria,
      monto,
      fecha,
    });

    return { aporte: limpiarAporte(aporte), meta: limpiarMeta(metaActualizada) };
  },

  async eliminarAporte(idUsuario, idMeta, idAporte) {
    const aporte = await metasRepositorio.buscarAporte(idAporte);

    if (!aporte || aporte.idMeta !== idMeta || aporte.meta.idUsuario !== idUsuario) {
      throw new ErrorApi('Aporte no encontrado', 404);
    }

    // la transaccion generada se elimina en la misma operacion, revirtiendo el saldo
    await metasRepositorio.eliminarAporteConTransaccion(aporte);
  },

  async actualizarAporte(idUsuario, idMeta, idAporte, datos) {
    const aporte = await metasRepositorio.buscarAporte(idAporte);

    if (!aporte || aporte.idMeta !== idMeta || aporte.meta.idUsuario !== idUsuario) {
      throw new ErrorApi('Aporte no encontrado', 404);
    }

    const cuenta = await cuentasRepositorio.buscarCuenta(idUsuario, datos.idCuenta);

    if (!cuenta) {
      throw new ErrorApi('Cuenta no encontrada', 404);
    }

    const { aporte: aporteActualizado, metaActualizada } =
      await metasRepositorio.actualizarAporteConTransaccion(aporte, datos);

    return { aporte: limpiarAporte(aporteActualizado), meta: limpiarMeta(metaActualizada) };
  },
};
