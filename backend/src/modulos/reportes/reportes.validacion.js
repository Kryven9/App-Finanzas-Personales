import { z } from 'zod';
import { esquemaFechaTexto } from '../../compartido/utilidades/fechas.js';

// periodo unico (mes/año) -> gastos por categoria
export const esquemaGastosPorCategoria = z.object({
  mes: z.coerce
    .number('El mes es obligatorio')
    .int('El mes debe ser un numero entero')
    .min(1, 'El mes debe estar entre 1 y 12')
    .max(12, 'El mes debe estar entre 1 y 12'),
  anio: z.coerce
    .number('El año es obligatorio')
    .int('El año debe ser un numero entero')
    .min(2000, 'El año no es valido')
    .max(2100, 'El año no es valido'),
});

// rango de fechas -> evolucion y flujo de caja, ambos comparten el mismo filtro
export const esquemaEvolucion = z
  .object({
    desde: esquemaFechaTexto,
    hasta: esquemaFechaTexto,
  })
  .refine((rango) => rango.desde <= rango.hasta, {
    message: 'La fecha desde no puede ser mayor a la fecha hasta',
    path: ['desde'],
  });
