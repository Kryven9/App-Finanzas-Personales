import { z } from 'zod';
import { TIPOS_MOVIMIENTO } from '../compartido/tipos-movimiento';
import { FRECUENCIAS } from '../compartido/frecuencias';

const valoresTipoMovimiento = TIPOS_MOVIMIENTO.map((tipo) => tipo.valor);
const valoresFrecuencia = FRECUENCIAS.map((frecuencia) => frecuencia.valor);

export const esquemaRecurrencia = z.object({
  tipo: z.enum(valoresTipoMovimiento, 'Selecciona un tipo de transaccion valido'),
  monto: z
    .number('El monto es obligatorio')
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto no puede exceder 999999999'),
  frecuencia: z.enum(valoresFrecuencia, 'Selecciona una frecuencia valida'),
  fechaInicio: z
    .string('La fecha de inicio es obligatoria')
    .refine((valor) => !Number.isNaN(Date.parse(valor)), 'Fecha invalida'),
  idCuenta: z.string('Selecciona una cuenta').min(1, 'Selecciona una cuenta'),
  idCategoria: z.string('Selecciona una categoria').min(1, 'Selecciona una categoria'),
  descripcion: z
    .string('La descripcion debe ser texto')
    .trim()
    .max(255, 'La descripcion no puede exceder 255 caracteres')
    .optional(),
});
