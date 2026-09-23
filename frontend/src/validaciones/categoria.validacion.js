import { z } from 'zod';
import { TIPOS_CATEGORIA } from '../compartido/tipos-categoria';

const valoresTipoCategoria = TIPOS_CATEGORIA.map((tipo) => tipo.valor);

export const esquemaCategoria = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres'),
  tipo: z.enum(valoresTipoCategoria, 'Selecciona un tipo de categoria valido'),
});
