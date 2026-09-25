import { create } from 'zustand';
import { metaServicio } from '../servicios/meta.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';

// store global de metas
export const useMetasStore = create((set, get) => ({
  metas: [],
  cargando: true,
  // detalle activo
  meta: null,
  aportes: [],
  cargandoDetalle: false,

  cargar: async () => {
    try {
      const datos = await metaServicio.listar();
      set({ metas: datos });
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudieron cargar las metas'));
    } finally {
      set({ cargando: false });
    }
  },

  crear: async (datos) => {
    try {
      await metaServicio.crear(datos);
      notificarExito('Meta creada');
      await get().cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear la meta'));
      return false;
    }
  },

  actualizarMeta: async (id, datos) => {
    try {
      await metaServicio.actualizar(id, datos);
      notificarExito('Meta actualizada');
      await get().cargar();

      // si el detalle abierto es esa meta, se refleja el cambio
      if (get().meta?.id === id) {
        set({ meta: await metaServicio.obtener(id) });
      }

      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar la meta'));
      return false;
    }
  },

  eliminarMeta: async (id) => {
    try {
      await metaServicio.eliminar(id);
      notificarExito('Meta eliminada');
      set({ metas: get().metas.filter((m) => m.id !== id) });

      // si el detalle abierto era esa meta, se limpia
      if (get().meta?.id === id) {
        set({ meta: null, aportes: [] });
      }

      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar la meta'));
      return false;
    }
  },

  // obtiene la meta y su historial; devuelve false si la meta no existe (la pagina decide regresar al listado)
  cargarDetalle: async (id) => {
    const mismoDetalle = get().meta?.id === id;
    set({
      ...(mismoDetalle ? {} : { meta: null, aportes: [] }),
      cargandoDetalle: true,
    });

    try {
      const [metaDetalle, historial] = await Promise.all([
        metaServicio.obtener(id),
        metaServicio.listarAportes(id),
      ]);
      set({ meta: metaDetalle, aportes: historial, cargandoDetalle: false });
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo cargar la meta'));
      set({ meta: null, aportes: [], cargandoDetalle: false });
      return false;
    }
  },

  crearAporte: async (idMeta, datos) => {
    try {
      await metaServicio.crearAporte(idMeta, datos);
      notificarExito('Aporte registrado');
      await get().cargar();

      // el historial del detalle abierto se refresca (orden por fecha)
      if (get().meta?.id === idMeta) {
        await get().cargarDetalle(idMeta);
      }

      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo registrar el aporte'));
      return false;
    }
  },

  actualizarAporte: async (idMeta, idAporte, datos) => {
    try {
      await metaServicio.actualizarAporte(idMeta, idAporte, datos);
      notificarExito('Aporte actualizado');
      await get().cargar();

      if (get().meta?.id === idMeta) {
        await get().cargarDetalle(idMeta);
      }

      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar el aporte'));
      return false;
    }
  },

  eliminarAporte: async (idMeta, idAporte) => {
    try {
      await metaServicio.eliminarAporte(idMeta, idAporte);
      notificarExito('Aporte eliminado');

      // el monto acumulado cambio -> se re-sincroniza listado y detalle
      await get().cargar();
      if (get().meta?.id === idMeta) {
        await get().cargarDetalle(idMeta);
      }

      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar el aporte'));
      return false;
    }
  },
}));
