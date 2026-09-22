import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { hashearContrasena, compararContrasena } from '../../compartido/utilidades/hash.js';
import { generarToken } from '../../compartido/utilidades/jwt.js';
import { autenticacionRepositorio } from './autenticacion.repositorio.js';

// quita el hash de la contraseña para no exponerlo en las respuestas
function limpiarUsuario(usuario) {
  const { contrasenaHash: _contrasenaHash, ...datos } = usuario;
  return datos;
}

export const autenticacionServicio = {
  async registrar(datos) {
    const correoRegistrado = await autenticacionRepositorio.buscarPorCorreo(datos.correo);

    if (correoRegistrado) {
      throw new ErrorApi('El correo ya esta registrado', 409);
    }

    const usuario = await autenticacionRepositorio.crear({
      nombre: datos.nombre,
      correo: datos.correo,
      contrasenaHash: await hashearContrasena(datos.contrasena),
    });

    return { token: generarToken(usuario.id), usuario: limpiarUsuario(usuario) };
  },

  async iniciarSesion({ correo, contrasena }) {
    const usuario = await autenticacionRepositorio.buscarPorCorreo(correo);
    const credencialesValidas =
      usuario && (await compararContrasena(contrasena, usuario.contrasenaHash));

    if (!credencialesValidas) {
      throw new ErrorApi('Credenciales invalidas', 401);
    }

    return { token: generarToken(usuario.id), usuario: limpiarUsuario(usuario) };
  },

  async obtenerPerfil(idUsuario) {
    const usuario = await autenticacionRepositorio.buscarPorId(idUsuario);

    if (!usuario) {
      throw new ErrorApi('Usuario no encontrado', 404);
    }

    return limpiarUsuario(usuario);
  },

  async actualizarPerfil(idUsuario, datos) {
    const usuario = await autenticacionRepositorio.buscarPorId(idUsuario);

    if (!usuario) {
      throw new ErrorApi('Usuario no encontrado', 404);
    }

    if (datos.correo !== usuario.correo) {
      const correoRegistrado = await autenticacionRepositorio.buscarPorCorreo(datos.correo);

      if (correoRegistrado) {
        throw new ErrorApi('El correo ya esta registrado', 409);
      }
    }

    const usuarioActualizado = await autenticacionRepositorio.actualizar(idUsuario, datos);
    return limpiarUsuario(usuarioActualizado);
  },

  async cambiarContrasena(idUsuario, { contrasenaActual, nuevaContrasena }) {
    const usuario = await autenticacionRepositorio.buscarPorId(idUsuario);

    if (!usuario) {
      throw new ErrorApi('Usuario no encontrado', 404);
    }

    const contrasenaCorrecta = await compararContrasena(contrasenaActual, usuario.contrasenaHash);

    if (!contrasenaCorrecta) {
      throw new ErrorApi('La contraseña actual es incorrecta', 400);
    }

    const passwordHash = await hashearContrasena(nuevaContrasena);
    await autenticacionRepositorio.actualizar(idUsuario, {
      contrasenaHash: passwordHash,
    });

    return { mensaje: 'Contraseña actualizada correctamente' };
  },
};
