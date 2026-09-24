import { TrendingDown, TrendingUp } from 'lucide-react';

// tipos de movimiento (ingreso/gasto) compartidos por los modulos de categorias y
// transacciones -> etiqueta, icono y clases del badge de cada tipo
export const TIPOS_MOVIMIENTO = [
  {
    valor: 'INGRESO',
    etiqueta: 'Ingreso',
    icono: TrendingUp,
    clases: 'bg-violet-100 text-violet-700',
  },
  {
    valor: 'GASTO',
    etiqueta: 'Gasto',
    icono: TrendingDown,
    clases: 'bg-red-100 text-red-600',
  },
];

// filtros de la pagina de categorias: todas + una por tipo
export const FILTROS_CATEGORIA = [
  { valor: 'TODAS', etiqueta: 'Todas' },
  ...TIPOS_MOVIMIENTO.map(({ valor, etiqueta }) => ({ valor, etiqueta: `${etiqueta}s` })),
];

export function obtenerTipoMovimiento(valor) {
  return TIPOS_MOVIMIENTO.find((tipo) => tipo.valor === valor);
}
