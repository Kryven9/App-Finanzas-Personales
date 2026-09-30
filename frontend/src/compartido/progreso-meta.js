import { porcentaje } from './formato';

// progreso de una meta de ahorro -> porcentaje limitado a 100, estado de completada y las clases
//  de estilo asociadas al estado
export function calcularProgresoMeta(meta) {
  const porcentajeMeta = Math.min(100, porcentaje(meta.montoActual, meta.montoObjetivo));
  const completada = meta.montoActual >= meta.montoObjetivo;

  return {
    porcentaje: porcentajeMeta,
    completada,
    clasesIcono: completada ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700',
    clasesBarra: completada ? 'bg-emerald-500' : 'bg-violet-500',
  };
}
