import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { validarRelacionesTransaccion } from '../../compartido/servicios/validar-relaciones.js';
import { recurrenciasRepositorio } from './recurrencias.repositorio.js';

// convierte los montos Decimal a numero y aplana los nombres de las relaciones
function limpiarRecurrencia(regla) {
  const { idUsuario: _idUsuario, cuenta, categoria, _count, ...datos } = regla;
  return {
    ...datos,
    monto: Number(regla.monto),
    cuentaNombre: cuenta?.nombre ?? '',
    categoriaNombre: categoria?.nombre ?? '',
    transaccionesGeneradas: _count?.transacciones ?? 0,
  };
}

// suma meses respetando el ultimo dia del mes destino (31 de enero -> 28/29 de febrero)
function sumarMeses(fecha, cantidad) {
  const primerDiaSiguiente = new Date(
    Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth() + cantidad, 1),
  );
  const ultimoDia = new Date(
    Date.UTC(primerDiaSiguiente.getUTCFullYear(), primerDiaSiguiente.getUTCMonth() + 1, 0),
  ).getUTCDate();

  return new Date(
    Date.UTC(
      primerDiaSiguiente.getUTCFullYear(),
      primerDiaSiguiente.getUTCMonth(),
      Math.min(fecha.getUTCDate(), ultimoDia),
    ),
  );
}

// siguiente fecha de generacion de la serie segun la frecuencia de la regla
function avanzarProximaFecha(fecha, frecuencia) {
  if (frecuencia === 'SEMANAL') {
    return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate() + 7));
  }
  return sumarMeses(fecha, frecuencia === 'ANUAL' ? 12 : 1);
}

// los ciclos con fecha hasta hoy se generan; el primer dia siguiente queda como proxima
// fecha de la regla
function calcularCiclosPendientes(regla, ahora) {
  const fechasCiclos = [];
  let fecha = new Date(regla.proximaFechaGeneracion);

  while (fecha <= ahora) {
    fechasCiclos.push(fecha);
    fecha = avanzarProximaFecha(fecha, regla.frecuencia);
  }

  return { fechasCiclos, proximaFecha: fecha };
}

// la proxima fecha de la regla aun no vencida se conserva; si quedo atrasada (periodo desactivado)
// se salta hasta la primera fecha >= hoy sin generar ciclos
function proximaDesdeHoy(regla) {
  const hoy = new Date();
  hoy.setUTCHours(0, 0, 0, 0);

  let proxima = new Date(regla.proximaFechaGeneracion);

  while (proxima < hoy) {
    proxima = avanzarProximaFecha(proxima, regla.frecuencia);
  }

  return proxima;
}

// lazy generation -> genera los ciclos vencidos de las reglas activas del usuario antes de responder
// una consulta relevante (transacciones, cuentas o reglas)
async function generarPendientes(idUsuario) {
  const pendientes = await recurrenciasRepositorio.listarPendientes(idUsuario);

  let generadas = 0;

  for (const regla of pendientes) {
    const { fechasCiclos, proximaFecha } = calcularCiclosPendientes(regla, new Date());
    generadas += await recurrenciasRepositorio.generarCiclos(regla, fechasCiclos, proximaFecha);
  }

  return generadas;
}

export const recurrenciasServicio = {
  generarPendientes,

  async listar(idUsuario) {
    await generarPendientes(idUsuario);
    const reglas = await recurrenciasRepositorio.listar(idUsuario);
    return reglas.map(limpiarRecurrencia);
  },

  async obtenerPorId(idUsuario, id) {
    await generarPendientes(idUsuario);

    const regla = await recurrenciasRepositorio.buscarPorId(idUsuario, id);

    if (!regla) {
      throw new ErrorApi('Regla no encontrada', 404);
    }

    return limpiarRecurrencia(regla);
  },

  async crear(idUsuario, datos) {
    await validarRelacionesTransaccion(idUsuario, datos);

    const regla = await recurrenciasRepositorio.crear(idUsuario, {
      ...datos,
      // el primer ciclo de la serie es la fecha de inicio
      proximaFechaGeneracion: datos.fechaInicio,
    });

    return limpiarRecurrencia(regla);
  },

  async actualizar(idUsuario, id, datos) {
    const regla = await recurrenciasRepositorio.buscarPorId(idUsuario, id);

    if (!regla) {
      throw new ErrorApi('Regla no encontrada', 404);
    }

    // el tipo no es editable -> la nueva categoria debe coincidir con el tipo actual
    await validarRelacionesTransaccion(idUsuario, { ...datos, tipo: regla.tipo });

    const actualizada = await recurrenciasRepositorio.actualizar(id, datos);
    return limpiarRecurrencia(actualizada);
  },

  async cambiarEstado(idUsuario, id, activa) {
    const regla = await recurrenciasRepositorio.buscarPorId(idUsuario, id);

    if (!regla) {
      throw new ErrorApi('Regla no encontrada', 404);
    }

    const datos = { activa };

    // al reactivar se saltan los ciclos que se dejaron de generar mientras estuvo desactivada
    if (activa && !regla.activa) {
      datos.proximaFechaGeneracion = proximaDesdeHoy(regla);
    }

    const actualizada = await recurrenciasRepositorio.actualizar(id, datos);
    return limpiarRecurrencia(actualizada);
  },

  async eliminar(idUsuario, id, eliminarGeneradas) {
    const regla = await recurrenciasRepositorio.buscarPorId(idUsuario, id);

    if (!regla) {
      throw new ErrorApi('Regla no encontrada', 404);
    }

    if (eliminarGeneradas) {
      await recurrenciasRepositorio.eliminarTransaccionesGeneradas(id);
    }

    // sin transacciones que borrar, eliminar la regla deja las generadas como independientes
    await recurrenciasRepositorio.eliminar(id);
  },
};
