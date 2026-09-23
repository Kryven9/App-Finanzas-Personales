import { z } from 'zod';
import { TIPOS_CUENTA } from '../compartido/tipos-cuenta';

const valoresTipoCuenta = TIPOS_CUENTA.map((tipo) => tipo.valor);

export const esquemaCuenta = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres'),
  tipo: z.enum(valoresTipoCuenta, 'Selecciona un tipo de cuenta valido'),
  saldoInicial: z
    .number('El saldo inicial es obligatorio')
    .min(0, 'El saldo inicial no puede ser negativo')
    .max(999999999, 'El saldo inicial no puede exceder 999999999'),
});
