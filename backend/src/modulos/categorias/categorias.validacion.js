import { z } from 'zod';

const TIPOS_CATEGORIA = ['INGRESO', 'GASTO'];

export const esquemaCategoria = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres'),
  tipo: z.enum(TIPOS_CATEGORIA, 'Selecciona un tipo de categoria valido'),
});
