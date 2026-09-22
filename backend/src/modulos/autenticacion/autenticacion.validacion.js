import { z } from 'zod';

const campoNombre = z
  .string('El nombre es obligatorio')
  .trim()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(255, 'El nombre no puede exceder 255 caracteres');

const campoCorreo = z
  .email('El correo no es valido')
  .max(255, 'El correo no puede exceder 255 caracteres');

const campoContrasena = (mensajeObligatoria) =>
  z
    .string(mensajeObligatoria)
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede exceder 255 caracteres');

export const esquemaRegistro = z
  .object({
    nombre: campoNombre,
    correo: campoCorreo,
    contrasena: campoContrasena('La contraseña es obligatoria'),
    confirmarContrasena: z.string('Debes confirmar la contraseña').min(1, 'Confirma la contraseña'),
  })
  .refine((datos) => datos.contrasena === datos.confirmarContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContrasena'],
  });

export const esquemaIniciarSesion = z.object({
  correo: campoCorreo,
  contrasena: z.string('La contraseña es obligatoria').min(1, 'La contraseña es obligatoria'),
});

export const esquemaActualizarPerfil = z.object({
  nombre: campoNombre,
  correo: campoCorreo,
});

export const esquemaCambioContrasena = z
  .object({
    contrasenaActual: z
      .string('La contraseña actual es obligatoria')
      .min(1, 'La contraseña actual es obligatoria'),
    nuevaContrasena: campoContrasena('La nueva contraseña es obligatoria'),
    confirmarContrasena: z
      .string('Debes confirmar la nueva contraseña')
      .min(1, 'Confirma la nueva contraseña'),
  })
  .refine((datos) => datos.nuevaContrasena === datos.confirmarContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContrasena'],
  });
