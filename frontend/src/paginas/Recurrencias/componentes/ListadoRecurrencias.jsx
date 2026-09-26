import { Plus } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import TablaRecurrencias from './TablaRecurrencias';

// seccion de carga, estado vacio y tabla de reglas de recurrencia
export default function ListadoRecurrencias({
  cargando,
  recurrencias,
  onNueva,
  onEditar,
  onCambiarEstado,
  onEliminar,
}) {
  return cargando ? (
    <Cargando />
  ) : recurrencias.length === 0 ? (
    <EstadoVacio
      titulo="Aun no tienes reglas de recurrencia"
      descripcion="Crea una regla para que tus ingresos o gastos periodicos se registren solos"
      accion={
        <Boton onClick={onNueva}>
          <Plus className="h-4 w-4" />
          Crear regla
        </Boton>
      }
    />
  ) : (
    <TablaRecurrencias
      recurrencias={recurrencias}
      onEditar={onEditar}
      onCambiarEstado={onCambiarEstado}
      onEliminar={onEliminar}
    />
  );
}
