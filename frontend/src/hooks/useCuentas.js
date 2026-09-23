import { useCallback, useEffect, useState } from 'react';
import { cuentaServicio } from '../servicios/cuenta.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';

// hook que gestiona el listado de cuentas, el patrimonio neto y las operaciones CRUD
export function useCuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [patrimonioNeto, setPatrimonioNeto] = useState(0);
  const [cargando, setCargando] = useState(true);

  // el listado se recarga despues de cada operacion CRUD
  const cargar = useCallback(() => {
    cuentaServicio
      .listar()
      .then((datos) => {
        setCuentas(datos.cuentas);
        setPatrimonioNeto(datos.patrimonioNeto);
      })
      .catch((error) => {
        notificarError(obtenerMensajeError(error, 'No se pudieron cargar las cuentas'));
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
      await cuentaServicio.crear(datos);
      notificarExito('Cuenta creada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear la cuenta'));
      return false;
    }
  }

  async function actualizar(id, datos) {
    try {
      await cuentaServicio.actualizar(id, datos);
      notificarExito('Cuenta actualizada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar la cuenta'));
      return false;
    }
  }

  async function eliminar(id) {
    try {
      await cuentaServicio.eliminar(id);
      notificarExito('Cuenta eliminada');
      cargar();
    } catch (error) {
      // el backend bloquea el borrado si la cuenta tiene transacciones y lo informa
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar la cuenta'));
    }
  }

  return { cuentas, patrimonioNeto, cargando, crear, actualizar, eliminar };
}
