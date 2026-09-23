import { TrendingDown, TrendingUp } from 'lucide-react';

// tipos de categoria con su etiqueta e icono
export const TIPOS_CATEGORIA = [
  { valor: 'INGRESO', etiqueta: 'Ingreso', icono: TrendingUp },
  { valor: 'GASTO', etiqueta: 'Gasto', icono: TrendingDown },
];

// filtros de la pagina de categorias: todas + una por tipo
export const FILTROS_CATEGORIA = [
  { valor: 'TODAS', etiqueta: 'Todas' },
  ...TIPOS_CATEGORIA.map(({ valor, etiqueta }) => ({ valor, etiqueta: `${etiqueta}s` })),
];

export function obtenerTipoCategoria(valor) {
  return TIPOS_CATEGORIA.find((tipo) => tipo.valor === valor);
}
