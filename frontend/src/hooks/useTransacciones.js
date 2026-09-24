import { useCallback, useEffect, useRef, useState } from 'react';
import { transaccionServicio } from '../servicios/transaccion.servicio';
import { obtenerMensajeError } from '../compartido/mensajes-error';
import { notificarExito, notificarError } from '../compartido/notificaciones';

// hook que gestiona el listado de las transacciones y su CRUD;
// los filtros aplicados se recuerdan para navegar entre paginas y refrescar tras el CRUD
export function useTransacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [paginacion, setPaginacion] = useState({ pagina: 1, haySiguiente: false });
  const [cargando, setCargando] = useState(true);

  // historial de cursores -> cursores[i] es el cursor con el que se carga la pagina i (i desde 0)
  const cursores = useRef([null]);
  const filtros = useRef({});

  const cargarPagina = useCallback((indicePagina) => {
    const despuesDe = cursores.current[indicePagina] ?? null;

    transaccionServicio
      .listar({ ...filtros.current, despuesDe })
      .then((datos) => {
        setTransacciones(datos.transacciones);

        if (datos.cursorSiguiente) {
          cursores.current[indicePagina + 1] = datos.cursorSiguiente;
        } else {
          // sin pagina siguiente -> se descartan los cursores guardados mas adelante
          cursores.current = cursores.current.slice(0, indicePagina + 1);
        }

        setPaginacion({
          pagina: indicePagina + 1,
          haySiguiente: Boolean(datos.cursorSiguiente),
        });
      })
      .catch((error) => {
        notificarError(obtenerMensajeError(error, 'No se pudieron cargar las transacciones'));
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // carga desde la primera pagina -> al montar, al aplicar filtros y al refrescar tras el CRUD
  const cargar = useCallback(
    (nuevosFiltros = {}) => {
      filtros.current = nuevosFiltros;
      cursores.current = [null];
      cargarPagina(0);
    },
    [cargarPagina],
  );

  const cambiarPagina = useCallback(
    (pagina) => {
      cargarPagina(pagina - 1);
    },
    [cargarPagina],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function crear(datos) {
    try {
      await transaccionServicio.crear(datos);
      notificarExito('Transaccion creada');
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo registrar la transaccion'));
      return false;
    }
  }

  async function actualizar(id, datos) {
    try {
      await transaccionServicio.actualizar(id, datos);
      notificarExito('Transaccion actualizada');
      return true;
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar la transaccion'));
      return false;
    }
  }

  async function eliminar(id) {
    try {
      await transaccionServicio.eliminar(id);
      notificarExito('Transaccion eliminada');
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo eliminar la transaccion'));
    }
  }

  return {
    transacciones,
    paginacion,
    cargando,
    cargar,
    cambiarPagina,
    crear,
    actualizar,
    eliminar,
  };
}
