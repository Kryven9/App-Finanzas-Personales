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

// periodo actual a partir de la fecha de hoy
export function periodoActual() {
  const hoy = fechaHoy();
  return { mes: Number(hoy.slice(5, 7)), anio: Number(hoy.slice(0, 4)) };
}
