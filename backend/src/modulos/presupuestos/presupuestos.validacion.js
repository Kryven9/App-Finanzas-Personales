import { z } from 'zod';

const campoMontoLimite = z
  .number('El monto limite es obligatorio')
  .positive('El monto limite debe ser mayor a 0')
  .max(999999999, 'El monto limite no puede exceder 999999999');

const campoMes = z
  .number('El mes es obligatorio')
  .int('Mes invalido')
  .min(1, 'Mes invalido')
  .max(12, 'Mes invalido');

const campoAnio = z
  .number('El anio es obligatorio')
  .int('Año invalido')
  .min(2000, 'Año invalido')
  .max(2100, 'Año invalido');

export const esquemaCrearPresupuesto = z.object({
  idCategoria: z.string('Selecciona una categoria').min(1, 'Selecciona una categoria'),
  montoLimite: campoMontoLimite,
  mes: campoMes,
  anio: campoAnio,
});

// la edicion solo permite cambiar el monto limite
export const esquemaActualizarPresupuesto = z.object({
  montoLimite: campoMontoLimite,
});

// periodo del listado (query params) -> llegan como texto y se convierten a numero
export const esquemaFiltrosPresupuesto = z.object({
  mes: z.coerce
    .number('Mes invalido')
    .int('Mes invalido')
    .min(1, 'Mes invalido')
    .max(12, 'Mes invalido'),
  anio: z.coerce
    .number('Año invalido')
    .int('Año invalido')
    .min(2000, 'Año invalido')
    .max(2100, 'Año invalido'),
});
