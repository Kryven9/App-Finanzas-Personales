import { z } from 'zod';

const campoMonto = z
  .number('El monto es obligatorio')
  .positive('El monto debe ser mayor a 0')
  .max(999999999, 'El monto no puede exceder 999999999');

const campoNombre = z
  .string('El nombre es obligatorio')
  .trim()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(60, 'El nombre no puede exceder 60 caracteres');

// las fechas viajan como texto y se convierten a Date
const campoFecha = (mensaje) =>
  z
    .string(mensaje)
    .min(1, mensaje)
    .refine((valor) => !Number.isNaN(Date.parse(valor)), 'Fecha invalida')
    .transform((valor) => new Date(valor));

export const esquemaMeta = z.object({
  nombre: campoNombre,
  montoObjetivo: campoMonto,
  fechaObjetivo: campoFecha('La fecha limite es obligatoria'),
});

export const esquemaAporte = z.object({
  monto: campoMonto,
  fecha: campoFecha('La fecha es obligatoria'),
  idCuenta: z.string('Selecciona una cuenta').min(1, 'Selecciona una cuenta'),
});
