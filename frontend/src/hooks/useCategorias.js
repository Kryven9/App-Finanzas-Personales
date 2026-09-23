import { useCallback, useEffect, useState } from 'react';
import { categoriaServicio } from '../servicios/categoria.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';

// hook que gestiona el listado de categorias (predefinidas + propias) y las operaciones CRUD
export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // el listado se recarga despues de cada operacion CRUD
  const cargar = useCallback(() => {
    categoriaServicio
      .listar()
      .then((datos) => {
        setCategorias(datos);
      })
      .catch((error) => {
        notificarError(obtenerMensajeError(error, 'No se pudieron cargar las categorias'));
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
      await categoriaServicio.crear(datos);
      notificarExito('Categoria creada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear la categoria'));
      return false;
    }
  }

  async function actualizar(id, datos) {
    try {
      await categoriaServicio.actualizar(id, datos);
      notificarExito('Categoria actualizada');
      cargar();
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar la categoria'));
      return false;
    }
  }

  async function eliminar(id) {
    try {
      await categoriaServicio.eliminar(id);
      notificarExito('Categoria eliminada');
      cargar();
    } catch (error) {
      // el backend bloquea el borrado de predefinidas o con usos y lo informa
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar la categoria'));
    }
  }

  return { categorias, cargando, crear, actualizar, eliminar };
}
