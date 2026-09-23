import { Plus } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import TablaCategorias from './TablaCategorias';

// seccion de carga, estados vacios y tabla de categorias
export default function ListadoCategorias({
  cargando,
  totalCategorias,
  categoriasFiltradas,
  onNueva,
  onEditar,
  onEliminar,
}) {
  return cargando ? (
    <Cargando />
  ) : totalCategorias === 0 ? (
    <EstadoVacio
      titulo="No hay categorias disponibles"
      descripcion="Puedes crear tu propia categoria para empezar"
      accion={
        <Boton onClick={onNueva}>
          <Plus className="h-4 w-4" />
          Crear categoria
        </Boton>
      }
    />
  ) : categoriasFiltradas.length === 0 ? (
    <EstadoVacio titulo="No hay categorias de este tipo" />
  ) : (
    <TablaCategorias categorias={categoriasFiltradas} onEditar={onEditar} onEliminar={onEliminar} />
  );
}
