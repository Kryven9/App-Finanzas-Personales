import { Plus } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import TarjetaPresupuesto from './TarjetaPresupuesto';

// seccion de carga, estado vacio y grilla de presupuestos del periodo
export default function ListadoPresupuestos({
  cargando,
  presupuestos,
  onNueva,
  onEditar,
  onEliminar,
}) {
  return cargando ? (
    <Cargando />
  ) : presupuestos.length === 0 ? (
    <EstadoVacio
      titulo="Aun no tienes presupuestos para este periodo"
      descripcion="Define un limite mensual de gasto por categoria para llevar el control"
      accion={
        <Boton onClick={onNueva}>
          <Plus className="h-4 w-4" />
          Crear presupuesto
        </Boton>
      }
    />
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {presupuestos.map((presupuesto) => (
        <TarjetaPresupuesto
          key={presupuesto.id}
          presupuesto={presupuesto}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  );
}
