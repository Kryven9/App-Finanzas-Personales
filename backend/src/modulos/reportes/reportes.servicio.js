import { construirPeriodo, construirRango } from '../../compartido/utilidades/fechas.js';
import { redondearMonto } from '../../compartido/utilidades/montos.js';
import { recurrenciasServicio } from '../recurrencias/recurrencias.servicio.js';
import { reportesRepositorio } from './reportes.repositorio.js';

// una fila por mes del rango pedido, con los meses sin transacciones en cero;
// recibe el rango ya construido { inicio, fin } y solo mira anio y mes
function filasPorMes({ inicio, fin }) {
  const filas = [];

  let anio = inicio.getUTCFullYear();
  let mes = inicio.getUTCMonth();

  while (
    anio < fin.getUTCFullYear() ||
    (anio === fin.getUTCFullYear() && mes <= fin.getUTCMonth())
  ) {
    filas.push({ anio, mes: mes + 1, ingresos: 0, gastos: 0, neto: 0 });
    mes += 1;
    if (mes > 11) {
      mes = 0;
      anio += 1;
    }
  }

  return filas;
}

export const reportesServicio = {
  async gastosPorCategoria(idUsuario, { mes, anio }) {
    await recurrenciasServicio.generarPendientes(idUsuario);

    const rango = construirPeriodo(mes, anio);
    const gastos = await reportesRepositorio.listarGastos(idUsuario, rango);
    const porCategoria = new Map();

    for (const gasto of gastos) {
      const acumulado = porCategoria.get(gasto.idCategoria) ?? {
        idCategoria: gasto.idCategoria,
        categoriaNombre: gasto.categoria.nombre,
        total: 0,
      };

      acumulado.total += Number(gasto.monto);
      porCategoria.set(gasto.idCategoria, acumulado);
    }

    // de mayor a menor gasto para que el grafico de barras horizontales se lea de arriba abajo
    return [...porCategoria.values()]
      .map((fila) => ({ ...fila, total: redondearMonto(fila.total) }))
      .sort((a, b) => b.total - a.total);
  },

  async evolucion(idUsuario, { desde, hasta }) {
    await recurrenciasServicio.generarPendientes(idUsuario);

    const rango = construirRango({ inicio: desde, fin: hasta });
    const transacciones = await reportesRepositorio.listarTransacciones(idUsuario, rango);
    const filas = filasPorMes(rango);
    const posiciones = new Map(
      filas.map((fila, posicion) => [`${fila.anio}-${fila.mes}`, posicion]),
    );

    for (const transaccion of transacciones) {
      const clave = `${transaccion.fecha.getUTCFullYear()}-${transaccion.fecha.getUTCMonth() + 1}`;
      const posicion = posiciones.get(clave);

      // fechas fuera del rango pedido (mes incompleto al inicio o al final)
      if (posicion === undefined) continue;

      const monto = Number(transaccion.monto);
      const fila = filas[posicion];

      if (transaccion.tipo === 'INGRESO') fila.ingresos += monto;
      else fila.gastos += monto;
    }

    return filas.map((fila) => {
      const neto = fila.ingresos - fila.gastos;
      return {
        anio: fila.anio,
        mes: fila.mes,
        ingresos: redondearMonto(fila.ingresos),
        gastos: redondearMonto(fila.gastos),
        neto: redondearMonto(neto),
      };
    });
  },
};
