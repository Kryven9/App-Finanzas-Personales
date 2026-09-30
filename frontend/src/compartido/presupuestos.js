import { porcentaje, porcentajeExacto } from './formato';

// umbrales de alerta del presupuesto -> verde < 80%, ambar 80-99%, rojo >= 100%
export const PORCENTAJE_ADVERTENCIA = 80;
export const PORCENTAJE_EXCEDIDO = 100;

// porcentaje de gasto de un presupuesto, sin redondear
export function porcentajeDe(presupuesto) {
  return porcentajeExacto(presupuesto.gastoReal, presupuesto.montoLimite);
}

// totales del periodo -> presupuestado, gastado y su porcentaje
export function totalesDe(presupuestos) {
  const totalLimite = presupuestos.reduce((total, p) => total + p.montoLimite, 0);
  const totalGastado = presupuestos.reduce((total, p) => total + p.gastoReal, 0);

  return { totalLimite, totalGastado, porcentaje: porcentaje(totalGastado, totalLimite) };
}

// estado comun del presupuesto -> la tarjeta completa y el resumen del dashboard comparten umbrales,
// colores y etiquetas; se decide con el porcentaje exacto
export function estadoPresupuesto(presupuesto) {
  const valorExacto = porcentajeDe(presupuesto);
  const valorRedondeado = porcentaje(presupuesto.gastoReal, presupuesto.montoLimite);
  const superado = valorExacto >= PORCENTAJE_EXCEDIDO;
  const enAdvertencia = !superado && valorExacto >= PORCENTAJE_ADVERTENCIA;

  return {
    porcentaje: valorRedondeado,
    superado,
    enAdvertencia,
    enAlerta: superado || enAdvertencia,
    // verde -> disponible, ambar -> cerca del limite, rojo -> superado
    clasesEstado: superado ? 'text-red-600' : enAdvertencia ? 'text-amber-600' : 'text-emerald-600',
    clasesBarra: superado ? 'bg-red-500' : enAdvertencia ? 'bg-amber-500' : 'bg-emerald-500',
    clasesInsignia: superado
      ? 'bg-red-100 text-red-700'
      : enAdvertencia
        ? 'bg-amber-100 text-amber-700'
        : 'bg-emerald-100 text-emerald-700',
    etiqueta: superado ? 'Presupuesto superado' : enAdvertencia ? 'Cerca del limite' : 'Disponible',
  };
}
