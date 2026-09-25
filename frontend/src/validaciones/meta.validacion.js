import { z } from 'zod';

const campoMonto = z
  .number('El monto es obligatorio')
  .positive('El monto debe ser mayor a 0')
  .max(999999999, 'El monto no puede exceder 999999999');

const campoFecha = z
  .string('La fecha es obligatoria')
  .refine((valor) => !Number.isNaN(Date.parse(valor)), 'Fecha invalida');

export const esquemaMeta = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres'),
  montoObjetivo: campoMonto,
  fechaObjetivo: campoFecha,
});

export const esquemaAporte = z.object({
  monto: campoMonto,
  fecha: campoFecha,
  idCuenta: z.string('Selecciona una cuenta').min(1, 'Selecciona una cuenta'),
});
