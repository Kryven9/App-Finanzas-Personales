import { z } from 'zod';

export const esquemaPresupuesto = z.object({
  idCategoria: z.string('Selecciona una categoria').min(1, 'Selecciona una categoria'),
  montoLimite: z
    .number('El monto limite es obligatorio')
    .positive('El monto limite debe ser mayor a 0')
    .max(999999999, 'El monto limite no puede exceder 999999999'),
  mes: z
    .number('El mes es obligatorio')
    .int('Mes invalido')
    .min(1, 'Mes invalido')
    .max(12, 'Mes invalido'),
  anio: z
    .number('El año es obligatorio')
    .int('Año invalido')
    .min(2000, 'Año invalido')
    .max(2100, 'Año invalido'),
});
