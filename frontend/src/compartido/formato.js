const formatoMoneda = new Intl.NumberFormat('es', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// el sistema usa una sola divisa, se muestra con el simbolo $
export function formatearMoneda(monto) {
  return `$${formatoMoneda.format(monto)}`;
}
