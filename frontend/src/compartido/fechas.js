// fecha de hoy como texto YYYY-MM-DD (formato del input date)
export function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

// las fechas viajan como 'YYYY-MM-DDT00:00:00.000Z', se muestra solo la parte de fecha
export function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

// meses del año para los selectores de periodo
export const MESES = [
  { valor: 1, etiqueta: 'Enero' },
  { valor: 2, etiqueta: 'Febrero' },
  { valor: 3, etiqueta: 'Marzo' },
  { valor: 4, etiqueta: 'Abril' },
  { valor: 5, etiqueta: 'Mayo' },
  { valor: 6, etiqueta: 'Junio' },
  { valor: 7, etiqueta: 'Julio' },
  { valor: 8, etiqueta: 'Agosto' },
  { valor: 9, etiqueta: 'Septiembre' },
  { valor: 10, etiqueta: 'Octubre' },
  { valor: 11, etiqueta: 'Noviembre' },
  { valor: 12, etiqueta: 'Diciembre' },
];

export function obtenerNombreMes(mes) {
  return MESES.find((m) => m.valor === mes)?.etiqueta ?? '';
}

// años disponibles para los periodos: 4 atras y uno adelante del actual
export function aniosDisponibles() {
  const anioActual = new Date().getFullYear();

  return Array.from({ length: 6 }, (_, indice) => {
    const anio = anioActual - 4 + indice;
    return { valor: anio, etiqueta: String(anio) };
  });
}

// periodo {mes, anio} a partir de una fecha texto YYYY-MM-DD
export function periodoDeFecha(fecha) {
  const [anio, mes] = fecha.slice(0, 10).split('-');
  return { mes: Number(mes), anio: Number(anio) };
}

// periodo actual a partir de la fecha de hoy
export function periodoActual() {
  const hoy = fechaHoy();
  return periodoDeFecha(hoy);
}

// rango de fechas de los reportes -> 'cantidad' meses completos incluyendo el actual
export function rangoUltimosMeses(cantidad) {
  const hoy = new Date();
  const inicio = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - (cantidad - 1), 1));
  const fin = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + 1, 0));

  return { desde: inicio.toISOString().slice(0, 10), hasta: fin.toISOString().slice(0, 10) };
}

// etiqueta corta de un mes para los ejes de los graficos -> "Sep 25", "Ago 26"
export function etiquetaPeriodo(anio, mes) {
  return `${obtenerNombreMes(mes).slice(0, 3)} ${String(anio).slice(2)}`;
}

// rango completo entre dos meses -> del dia 1 al ultimo dia del mes final
export function rangoEntreMeses(desde, hasta) {
  const inicio = new Date(Date.UTC(desde.anio, desde.mes - 1, 1));
  // el dia 0 del mes siguiente es el ultimo dia del mes pedido
  const fin = new Date(Date.UTC(hasta.anio, hasta.mes, 0));

  return {
    desde: inicio.toISOString().slice(0, 10),
    hasta: fin.toISOString().slice(0, 10),
  };
}
