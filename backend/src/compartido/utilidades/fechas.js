import { z } from 'zod';

// esquema reutilizable de fechas en query params para rangos (YYYY-MM-DD)
export const esquemaFechaTexto = z
  .string('La fecha no es valida')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD');

// convierte un rango de fechas texto (YYYY-MM-DD) en objetos Date que cubren
// el dia completo de cada limite (00:00:00 al inicio y 23:59:59.999 al fin)
export function construirRango({ inicio, fin } = {}) {
  return {
    inicio: inicio && new Date(`${inicio}T00:00:00.000Z`),
    fin: fin && new Date(`${fin}T23:59:59.999Z`),
  };
}

// convierte el periodo (mes 1-12 / año) al rango de fechas del mes completo
export function construirPeriodo(mes, anio) {
  return {
    inicio: new Date(Date.UTC(anio, mes - 1, 1)),
    fin: new Date(Date.UTC(anio, mes, 0, 23, 59, 59, 999)),
  };
}
