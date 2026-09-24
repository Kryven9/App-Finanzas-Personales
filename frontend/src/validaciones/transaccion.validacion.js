import { z } from 'zod';
import { TIPOS_MOVIMIENTO } from '../compartido/tipos-movimiento';

const valoresTipoMovimiento = TIPOS_MOVIMIENTO.map((tipo) => tipo.valor);

export const esquemaTransaccion = z.object({
  tipo: z.enum(valoresTipoMovimiento, 'Selecciona un tipo de transaccion valido'),
  monto: z
    .number('El monto es obligatorio')
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto no puede exceder 999999999'),
  fecha: z
    .string('La fecha es obligatoria')
    .refine((valor) => !Number.isNaN(Date.parse(valor)), 'Fecha invalida'),
  idCuenta: z.string('Selecciona una cuenta').min(1, 'Selecciona una cuenta'),
  idCategoria: z.string('Selecciona una categoria').min(1, 'Selecciona una categoria'),
  descripcion: z
    .string('La descripcion debe ser texto')
    .trim()
    .max(255, 'La descripcion no puede exceder 255 caracteres')
    .optional(),
});
