import { Plus } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import TarjetaMeta from './TarjetaMeta';

// seccion de carga, estado vacio y grilla de metas de ahorro
export default function ListadoMetas({ cargando, metas, onNueva, onAportar }) {
  return cargando ? (
    <Cargando />
  ) : metas.length === 0 ? (
    <EstadoVacio
      titulo="Aun no tienes metas de ahorro"
      descripcion="Define un objetivo con monto y fecha limite para empezar a ahorrar"
      accion={
        <Boton onClick={onNueva}>
          <Plus className="h-4 w-4" />
          Crear meta
        </Boton>
      }
    />
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metas.map((meta) => (
        <TarjetaMeta key={meta.id} meta={meta} onAportar={onAportar} />
      ))}
    </div>
  );
}
