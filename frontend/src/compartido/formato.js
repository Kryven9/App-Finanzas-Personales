const formatoMoneda = new Intl.NumberFormat('es', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// el sistema usa una sola divisa, se muestra con el simbolo $
export function formatearMoneda(monto) {
  return `$${formatoMoneda.format(monto)}`;
}

const formatoMonedaCorta = new Intl.NumberFormat('es', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

// monto abreviado para los ejes de los graficos -> $1.2 mil, $3.4 M
export function formatearMonedaCorta(monto) {
  const signo = monto < 0 ? '-' : '';
  return `${signo}$${formatoMonedaCorta.format(Math.abs(monto))}`;
}

// porcentaje exacto,sin redondear -> sirve para comparar umbrales
export function porcentajeExacto(parte, total) {
  return (parte / total) * 100;
}

// porcentaje entero para mostrar -> 0 cuando no hay total (sin division por cero)
export function porcentaje(parte, total) {
  return total > 0 ? Math.round(porcentajeExacto(parte, total)) : 0;
}
