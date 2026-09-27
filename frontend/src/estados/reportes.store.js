import { create } from 'zustand';
import { reporteServicio } from '../servicios/reporte.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarError } from '../compartido/notificaciones';
import { etiquetaPeriodo } from '../compartido/fechas';

// store global de reportes, dos datasets -> gastos por un periodo unico y evolucion/flujo por un rango
// de fechas (ambos graficos comparten el rango)
export const useReportesStore = create((set) => ({
  gastos: [],
  evolucion: [],
  cargandoGastos: true,
  cargandoEvolucion: true,

  cargarGastos: async (periodo) => {
    try {
      const datos = await reporteServicio.gastosPorCategoria(periodo);
      set({ gastos: datos });
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudieron cargar los gastos'));
    } finally {
      set({ cargandoGastos: false });
    }
  },

  // la etiqueta corta del eje se arma aqui -> los graficos solo consumen la serie
  cargarEvolucion: async (rango) => {
    try {
      const filas = await reporteServicio.evolucion(rango);
      set({
        evolucion: filas.map((fila) => ({
          ...fila,
          etiqueta: etiquetaPeriodo(fila.anio, fila.mes),
        })),
      });
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo cargar la evolucion financiera'));
    } finally {
      set({ cargandoEvolucion: false });
    }
  },
}));
