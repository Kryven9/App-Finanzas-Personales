import { ErrorApi } from '../../compartido/middlewares/error.middleware.js';
import { categoriasRepositorio } from './categorias.repositorio.js';

function limpiarCategoria(categoria) {
  const { idUsuario: _idUsuario, ...datos } = categoria;
  return datos;
}

export const categoriasServicio = {
  async listar(idUsuario) {
    const categorias = await categoriasRepositorio.listar(idUsuario);
    return categorias.map(limpiarCategoria);
  },

  async crear(idUsuario, datos) {
    const categoria = await categoriasRepositorio.crear(idUsuario, datos);
    return limpiarCategoria(categoria);
  },

  async actualizar(idUsuario, id, datos) {
    const categoria = await categoriasRepositorio.buscarPorId(id);

    if (!categoria) {
      throw new ErrorApi('Categoria no encontrada', 404);
    }

    if (categoria.esPredefinida) {
      throw new ErrorApi('Las categorias predefinidas no son editables', 403);
    }

    // no revelar la existencia de categorias de otros usuarios
    if (categoria.idUsuario !== idUsuario) {
      throw new ErrorApi('Categoria no encontrada', 404);
    }

    if (datos.tipo !== categoria.tipo) {
      const usos = await categoriasRepositorio.contarUsos(id);

      if (usos.total > 0) {
        throw new ErrorApi(
          'No se puede cambiar el tipo porque la categoria tiene transacciones, presupuestos o recurrencias asociadas',
          409,
        );
      }
    }

    const actualizada = await categoriasRepositorio.actualizar(id, datos);
    return limpiarCategoria(actualizada);
  },

  async eliminar(idUsuario, id) {
    const categoria = await categoriasRepositorio.buscarPorId(id);

    if (!categoria) {
      throw new ErrorApi('Categoria no encontrada', 404);
    }

    if (categoria.esPredefinida) {
      throw new ErrorApi('Las categorias predefinidas no son eliminables', 403);
    }

    if (categoria.idUsuario !== idUsuario) {
      throw new ErrorApi('Categoria no encontrada', 404);
    }

    const usos = await categoriasRepositorio.contarUsos(id);

    if (usos.total > 0) {
      throw new ErrorApi(
        'No se puede eliminar la categoria porque tiene transacciones o presupuestos asociados. Elimina o reasigna esos registros primero.',
        409,
      );
    }

    await categoriasRepositorio.eliminar(id);
  },
};
