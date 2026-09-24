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
