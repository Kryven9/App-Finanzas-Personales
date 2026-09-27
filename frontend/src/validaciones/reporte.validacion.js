import { z } from 'zod';

const campoMes = z
  .number('Selecciona un mes')
  .int('Selecciona un mes')
  .min(1, 'Selecciona un mes')
  .max(12, 'Selecciona un mes');

const campoAnio = z
  .number('Selecciona un año')
  .int('Selecciona un año')
  .min(2000, 'El año no es valido')
  .max(2100, 'El año no es valido');

export const esquemaRangoMeses = z
  .object({
    desde: z.object({ mes: campoMes, anio: campoAnio }),
    hasta: z.object({ mes: campoMes, anio: campoAnio }),
  })
  .refine(
    (rango) =>
      rango.desde.anio < rango.hasta.anio ||
      (rango.desde.anio === rango.hasta.anio && rango.desde.mes <= rango.hasta.mes),
    {
      message: 'El periodo desde no puede ser posterior al periodo hasta',
      path: ['desde', 'mes'],
    },
  );
