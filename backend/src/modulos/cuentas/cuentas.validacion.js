import { z } from 'zod';

const TIPOS_CUENTA = ['EFECTIVO', 'BANCO', 'TARJETA_CREDITO', 'OTRO'];

export const esquemaCuenta = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres'),
  tipo: z.enum(TIPOS_CUENTA, 'Selecciona un tipo de cuenta valido'),
  saldoInicial: z
    .number('El saldo inicial es obligatorio')
    .min(0, 'El saldo inicial no puede ser negativo')
    .max(999999999, 'El saldo inicial no puede exceder 999999999'),
});
