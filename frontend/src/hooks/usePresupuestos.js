import { useCallback, useEffect, useRef, useState } from 'react';
import { presupuestoServicio } from '../servicios/presupuesto.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';
import { periodoActual } from '../compartido/fechas';

// hook que gestiona el listado de presupuestos por periodo y sus operaciones CRUD;
// el periodo aplicado se recuerda para refrescar tras cada operacion
export function usePresupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [periodo, setPeriodo] = useState(periodoActual());
  const [cargando, setCargando] = useState(true);
  const periodoAplicado = useRef(periodoActual());

  const cargar = useCallback((nuevoPeriodo) => {
    periodoAplicado.current = nuevoPeriodo;
    presupuestoServicio
      .listar(nuevoPeriodo)
      .then((datos) => {
        setPresupuestos(datos);
      })
      .catch((error) => {
        notificarError(obtenerMensajeError(error, 'No se pudieron cargar los presupuestos'));
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const cambiarPeriodo = useCallback(
    (nuevoPeriodo) => {
      setPeriodo(nuevoPeriodo);
      cargar(nuevoPeriodo);
    },
    [cargar],
  );

  useEffect(() => {
    cargar(periodoActual());
  }, [cargar]);

  async function crear(datos) {
    try {
      await presupuestoServicio.crear(datos);
      notificarExito('Presupuesto creado');
      cargar(periodoAplicado.current);
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear el presupuesto'));
      return false;
    }
  }

  async function actualizar(id, datos) {
    try {
      await presupuestoServicio.actualizar(id, datos);
      notificarExito('Presupuesto actualizado');
      cargar(periodoAplicado.current);
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar el presupuesto'));
      return false;
    }
  }

  async function eliminar(id) {
    try {
      await presupuestoServicio.eliminar(id);
      notificarExito('Presupuesto eliminado');
      cargar(periodoAplicado.current);
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar el presupuesto'));
    }
  }

  return { presupuestos, periodo, cargando, cambiarPeriodo, crear, actualizar, eliminar };
}
