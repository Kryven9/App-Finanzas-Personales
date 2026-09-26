import { useCallback, useEffect, useState } from 'react';
import { recurrenciaServicio } from '../servicios/recurrencia.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';

// hook que gestiona el listado de reglas de recurrencia y su CRUD;
// cada lectura del backend genera los ciclos pendientes de las reglas activas
export function useRecurrencias() {
  const [recurrencias, setRecurrencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    recurrenciaServicio
      .listar()
      .then((datos) => {
        setRecurrencias(datos);
      })
      .catch((error) => {
        notificarError(obtenerMensajeError(error, 'No se pudieron cargar las reglas'));
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function crear(datos) {
    try {
      await recurrenciaServicio.crear(datos);
      notificarExito('Regla creada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear la regla'));
      return false;
    }
  }

  async function actualizar(id, datos) {
    try {
      await recurrenciaServicio.actualizar(id, datos);
      notificarExito('Regla actualizada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar la regla'));
      return false;
    }
  }

  async function cambiarEstado(id, activa) {
    try {
      await recurrenciaServicio.cambiarEstado(id, activa);
      notificarExito(activa ? 'Regla activada' : 'Regla desactivada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo cambiar el estado de la regla'));
      return false;
    }
  }

  async function eliminar(id, eliminarGeneradas) {
    try {
      await recurrenciaServicio.eliminar(id, eliminarGeneradas);
      notificarExito('Regla eliminada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar la regla'));
      return false;
    }
  }

  return { recurrencias, cargando, cargar, crear, actualizar, cambiarEstado, eliminar };
}
