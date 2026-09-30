import { useEffect, useState } from 'react';
import { useCuentasStore } from '../estados/cuentas.store';
import { useMetasStore } from '../estados/metas.store';
import { usePresupuestosStore } from '../estados/presupuestos.store';
import { useReportesStore } from '../estados/reportes.store';
import { transaccionServicio } from '../servicios/transaccion.servicio';
import { periodoActual, rangoUltimosMeses } from '../compartido/fechas';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarError } from '../compartido/notificaciones';

// compone los stores del panel y carga sus secciones
export function useDashboard() {
  const {
    patrimonioNeto,
    cuentas,
    cargando: cargandoCuentas,
    cargar: cargarCuentas,
  } = useCuentasStore();
  const { metas, cargando: cargandoMetas, cargar: cargarMetas } = useMetasStore();
  const {
    presupuestos,
    cargando: cargandoPresupuestos,
    cargar: cargarPresupuestos,
  } = usePresupuestosStore();
  const { evolucion, gastos, cargandoEvolucion, cargandoGastos, cargarEvolucion, cargarGastos } =
    useReportesStore();
  const [recientes, setRecientes] = useState([]);
  const [cargandoRecientes, setCargandoRecientes] = useState(true);

  useEffect(() => {
    cargarCuentas();
    cargarMetas();
    cargarPresupuestos(periodoActual());
    // el mini grafico muestra los ultimos 4 meses y el top los gastos del mes en curso
    cargarEvolucion(rangoUltimosMeses(4));
    cargarGastos(periodoActual());

    async function cargarRecientes() {
      try {
        const ultimas = await transaccionServicio.listar({ limite: 5 });
        setRecientes(ultimas.transacciones);
      } catch (error) {
        notificarError(
          obtenerMensajeError(error, 'No se pudieron cargar las transacciones recientes'),
        );
      } finally {
        setCargandoRecientes(false);
      }
    }

    cargarRecientes();
  }, [cargarCuentas, cargarMetas, cargarPresupuestos, cargarEvolucion, cargarGastos]);

  const cargando = {
    patrimonio: cargandoCuentas,
    presupuestos: cargandoPresupuestos,
    flujo: cargandoEvolucion,
    topGastos: cargandoGastos,
    metas: cargandoMetas,
    recientes: cargandoRecientes,
  };

  return { patrimonioNeto, cuentas, presupuestos, evolucion, gastos, metas, recientes, cargando };
}
