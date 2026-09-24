// fecha de hoy como texto YYYY-MM-DD (formato del input date)
export function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

// las fechas viajan como 'YYYY-MM-DDT00:00:00.000Z', se muestra solo la parte de fecha
export function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}
