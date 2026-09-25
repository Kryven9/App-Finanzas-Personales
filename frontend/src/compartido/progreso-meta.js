// progreso de una meta de ahorro -> porcentaje limitado a 100, estado de completada y las clases
//  de estilo asociadas al estado
export function calcularProgresoMeta(meta) {
  const porcentaje = Math.min(100, Math.round((meta.montoActual / meta.montoObjetivo) * 100));
  const completada = meta.montoActual >= meta.montoObjetivo;

  return {
    porcentaje,
    completada,
    clasesIcono: completada ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700',
    clasesBarra: completada ? 'bg-emerald-500' : 'bg-violet-500',
  };
}
