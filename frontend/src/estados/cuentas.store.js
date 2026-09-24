import { create } from 'zustand';
import { cuentaServicio } from '../servicios/cuenta.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';

// store global de cuentas
export const useCuentasStore = create((set, get) => ({
  cuentas: [],
  patrimonioNeto: 0,
  cargando: true,

  cargar: async () => {
    try {
      const datos = await cuentaServicio.listar();
      set({ cuentas: datos.cuentas, patrimonioNeto: datos.patrimonioNeto });
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudieron cargar las cuentas'));
    } finally {
      set({ cargando: false });
    }
  },

  crear: async (datos) => {
    try {
      await cuentaServicio.crear(datos);
      notificarExito('Cuenta creada');
      await get().cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear la cuenta'));
      return false;
    }
  },

  actualizar: async (id, datos) => {
    try {
      await cuentaServicio.actualizar(id, datos);
      notificarExito('Cuenta actualizada');
      await get().cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar la cuenta'));
      return false;
    }
  },

  eliminar: async (id) => {
    try {
      await cuentaServicio.eliminar(id);
      notificarExito('Cuenta eliminada');
      await get().cargar();
    } catch (error) {
      // el backend bloquea el borrado si la cuenta tiene transacciones y lo informa
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar la cuenta'));
    }
  },
}));
