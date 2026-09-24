import { Plus } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import Paginacion from '../../../compartido/Paginacion';
import TablaTransacciones from './TablaTransacciones';

// seccion de carga, estado vacio, tabla y paginacion de transacciones
export default function ListadoTransacciones({
  cargando,
  transacciones,
  paginacion,
  onNueva,
  onEditar,
  onEliminar,
  onCambiarPagina,
}) {
  return cargando ? (
    <Cargando />
  ) : transacciones.length === 0 ? (
    <EstadoVacio
      titulo="Aun no tienes transacciones"
      descripcion="Registra tu primer ingreso o gasto para empezar a ver tu historial"
      accion={
        <Boton onClick={onNueva}>
          <Plus className="h-4 w-4" />
          Registrar transaccion
        </Boton>
      }
    />
  ) : (
    <>
      <TablaTransacciones
        transacciones={transacciones}
        onEditar={onEditar}
        onEliminar={onEliminar}
      />
      <Paginacion
        pagina={paginacion.pagina}
        haySiguiente={paginacion.haySiguiente}
        onCambiarPagina={onCambiarPagina}
      />
    </>
  );
}
