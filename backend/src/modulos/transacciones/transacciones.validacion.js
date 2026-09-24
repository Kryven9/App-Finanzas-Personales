import { z } from 'zod';
import { esquemaFechaTexto } from '../../compartido/utilidades/fechas.js';

const TIPOS_TRANSACCION = ['INGRESO', 'GASTO'];

// numero opcional de query param -> los vacios se convierten en ausentes
const numeroOpcional = z.preprocess(
  (valor) => (valor === '' || valor == null ? undefined : valor),
  z.coerce.number('Debe ser un numero').optional(),
);

// fecha opcional de query param en formato YYYY-MM-DD; los vacios se convierten en ausentes
const fechaOpcional = z.preprocess(
  (valor) => (valor === '' || valor == null ? undefined : valor),
  esquemaFechaTexto.optional(),
);

const campoMonto = z
  .number('El monto es obligatorio')
  .positive('El monto debe ser mayor a 0')
  .max(999999999, 'El monto no puede exceder 999999999');

const campoDescripcion = z
  .string('La descripcion debe ser texto')
  .trim()
  .max(255, 'La descripcion no puede exceder 255 caracteres')
  .optional();

export const esquemaCrearTransaccion = z.object({
  tipo: z.enum(TIPOS_TRANSACCION, 'Selecciona un tipo de transaccion valido'),
  monto: campoMonto,
  fecha: z.coerce.date('La fecha es obligatoria'),
  idCuenta: z.string('La cuenta es obligatoria'),
  idCategoria: z.string('La categoria es obligatoria'),
  descripcion: campoDescripcion,
});

// la edicion no permite cambiar el tipo; la categoria debe coincidir con el tipo actual
export const esquemaActualizarTransaccion = z.object({
  monto: campoMonto,
  fecha: z.coerce.date('La fecha es obligatoria'),
  idCuenta: z.string('La cuenta es obligatoria'),
  idCategoria: z.string('La categoria es obligatoria'),
  descripcion: campoDescripcion,
});

// filtros del listado (query params) -> fecha, categoria, cuenta y monto + paginacion por cursor
export const esquemaFiltrosTransaccion = z
  .object({
    fechaDesde: fechaOpcional,
    fechaHasta: fechaOpcional,
    idCuenta: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional()),
    idCategoria: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional()),
    montoMin: numeroOpcional,
    montoMax: numeroOpcional,
    // cursor de paginacion -> id de la ultima transaccion de la pagina anterior
    despuesDe: z.preprocess(
      (v) => (v === '' ? undefined : v),
      z.uuid('Cursor invalido').optional(),
    ),
  })
  .refine(
    (filtros) =>
      !filtros.fechaDesde || !filtros.fechaHasta || filtros.fechaDesde <= filtros.fechaHasta,
    { message: 'La fecha desde no puede ser mayor a la fecha hasta', path: ['fechaDesde'] },
  );
