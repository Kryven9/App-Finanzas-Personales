import { Plus } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import TarjetaCuenta from './TarjetaCuenta';

// seccion de carga, estado vacio y grilla de cuentas
export default function ListadoCuentas({ cargando, cuentas, onNueva, onEditar, onEliminar }) {
  return cargando ? (
    <Cargando />
  ) : cuentas.length === 0 ? (
    <EstadoVacio
      titulo="Aun no tienes cuentas"
      descripcion="Crea tu primera cuenta para empezar a registrar transacciones"
      accion={
        <Boton onClick={onNueva}>
          <Plus className="h-4 w-4" />
          Crear cuenta
        </Boton>
      }
    />
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cuentas.map((cuenta) => (
        <TarjetaCuenta
          key={cuenta.id}
          cuenta={cuenta}
          onEditar={() => onEditar(cuenta)}
          onEliminar={() => onEliminar(cuenta)}
        />
      ))}
    </div>
  );
}
