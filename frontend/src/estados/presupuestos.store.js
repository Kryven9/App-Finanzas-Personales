import { create } from 'zustand';
import { presupuestoServicio } from '../servicios/presupuesto.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';
import { periodoActual } from '../compartido/fechas';

// store global de presupuestos
export const usePresupuestosStore = create((set, get) => ({
  presupuestos: [],
  periodo: periodoActual(),
  cargando: true,

  cargar: async (nuevoPeriodo) => {
    set({ periodo: nuevoPeriodo });

    try {
      const datos = await presupuestoServicio.listar(nuevoPeriodo);
      set({ presupuestos: datos });
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudieron cargar los presupuestos'));
    } finally {
      set({ cargando: false });
    }
  },

  crear: async (datos) => {
    try {
      await presupuestoServicio.crear(datos);
      notificarExito('Presupuesto creado');
      await get().cargar(get().periodo);
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear el presupuesto'));
      return false;
    }
  },

  actualizar: async (id, datos) => {
    try {
      await presupuestoServicio.actualizar(id, datos);
      notificarExito('Presupuesto actualizado');
      await get().cargar(get().periodo);
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar el presupuesto'));
      return false;
    }
  },

  eliminar: async (id) => {
    try {
      await presupuestoServicio.eliminar(id);
      notificarExito('Presupuesto eliminado');
      await get().cargar(get().periodo);
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar el presupuesto'));
    }
  },
}));
