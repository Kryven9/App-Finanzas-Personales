import { create } from 'zustand';
import { categoriaServicio } from '../servicios/categoria.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';

// store global de categorias (predefinidas + propias),
export const useCategoriasStore = create((set, get) => ({
  categorias: [],
  cargando: true,

  cargar: async () => {
    try {
      const datos = await categoriaServicio.listar();
      set({ categorias: datos });
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudieron cargar las categorias'));
    } finally {
      set({ cargando: false });
    }
  },

  crear: async (datos) => {
    try {
      await categoriaServicio.crear(datos);
      notificarExito('Categoria creada');
      await get().cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear la categoria'));
      return false;
    }
  },

  actualizar: async (id, datos) => {
    try {
      await categoriaServicio.actualizar(id, datos);
      notificarExito('Categoria actualizada');
      await get().cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar la categoria'));
      return false;
    }
  },

  eliminar: async (id) => {
    try {
      await categoriaServicio.eliminar(id);
      notificarExito('Categoria eliminada');
      await get().cargar();
    } catch (error) {
      // el backend bloquea el borrado de predefinidas o con usos y lo informa
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar la categoria'));
    }
  },
}));
