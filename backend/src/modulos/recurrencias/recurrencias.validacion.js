import { z } from 'zod';

const TIPOS_TRANSACCION = ['INGRESO', 'GASTO'];
const FRECUENCIAS = ['SEMANAL', 'MENSUAL', 'ANUAL'];

const campoMonto = z
  .number('El monto es obligatorio')
  .positive('El monto debe ser mayor a 0')
  .max(999999999, 'El monto no puede exceder 999999999');

// las fechas viajan como texto y se convierten a Date
const campoFecha = (mensaje) =>
  z
    .string(mensaje)
    .min(1, mensaje)
    .refine((valor) => !Number.isNaN(Date.parse(valor)), 'Fecha invalida')
    .transform((valor) => new Date(valor));

const campoDescripcion = z
  .string('La descripcion debe ser texto')
  .trim()
  .max(255, 'La descripcion no puede exceder 255 caracteres')
  .optional();

const campoId = (mensaje) => z.string(mensaje).min(1, mensaje);

export const esquemaCrearRecurrencia = z.object({
  tipo: z.enum(TIPOS_TRANSACCION, 'Selecciona un tipo de transaccion valido'),
  monto: campoMonto,
  frecuencia: z.enum(FRECUENCIAS, 'Selecciona una frecuencia valida'),
  fechaInicio: campoFecha('La fecha de inicio es obligatoria'),
  idCuenta: campoId('La cuenta es obligatoria'),
  idCategoria: campoId('La categoria es obligatoria'),
  descripcion: campoDescripcion,
});

// la edicion no cambia el tipo (la nueva categoria debe coincidir con el tipo actual) ni
// la fecha de inicio
export const esquemaActualizarRecurrencia = z.object({
  monto: campoMonto,
  frecuencia: z.enum(FRECUENCIAS, 'Selecciona una frecuencia valida'),
  idCuenta: campoId('La cuenta es obligatoria'),
  idCategoria: campoId('La categoria es obligatoria'),
  descripcion: campoDescripcion,
});

export const esquemaEstadoRecurrencia = z.object({
  activa: z.boolean('El estado debe ser true o false'),
});

// query param de la eliminacion -> sin parametro se conservan las transacciones generadas
export const esquemaEliminarRecurrencia = z.object({
  eliminarGeneradas: z
    .enum(['true', 'false'], 'eliminarGeneradas debe ser true o false')
    .optional()
    .transform((valor) => valor === 'true'),
});
