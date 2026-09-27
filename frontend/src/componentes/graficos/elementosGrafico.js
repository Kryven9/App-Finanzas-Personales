import { formatearMoneda, formatearMonedaCorta } from '../../compartido/formato';

// configuracion compartida de los graficos mensuales (evolucion y flujo de caja);
export const EJE_TIEMPO = {
  dataKey: 'etiqueta',
  tickLine: false,
  axisLine: { stroke: '#D5D7E3' },
  tick: { fontSize: 12, fill: '#8D8EA6' },
};

export const EJE_MONEDA = {
  tickFormatter: formatearMonedaCorta,
  tickLine: false,
  axisLine: false,
  width: 64,
  tick: { fontSize: 12, fill: '#8D8EA6' },
};

export const CUADRICULA = {
  strokeDasharray: '3 3',
  stroke: '#D5D7E3',
  vertical: false,
};

// monto completo con $ y 2 decimales
export const formatearTooltip = (valor) => formatearMoneda(valor);
