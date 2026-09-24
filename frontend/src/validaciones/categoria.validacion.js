import { z } from 'zod';
import { TIPOS_MOVIMIENTO } from '../compartido/tipos-movimiento';

const valoresTipoMovimiento = TIPOS_MOVIMIENTO.map((tipo) => tipo.valor);

export const esquemaCategoria = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres'),
  tipo: z.enum(valoresTipoMovimiento, 'Selecciona un tipo de categoria valido'),
});
