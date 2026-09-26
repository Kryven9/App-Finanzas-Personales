import { Plus } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import TablaRecurrencias from './TablaRecurrencias';

// mensaje propio de cada estado
const MENSAJES_FILTRO = {
  activas: {
    titulo: 'No hay reglas activas',
    descripcion: 'Activa una regla pausada para que vuelva a generar transacciones automaticas',
  },
  pausadas: {
    titulo: 'No hay reglas pausadas',
    descripcion: 'Pausa una regla para dejar de generar transacciones hasta reactivarla',
  },
};

function coincideConFiltro(regla, filtro) {
  if (filtro === 'activas') return regla.activa;
  if (filtro === 'pausadas') return !regla.activa;
  return true;
}

// seccion de carga, estado vacio y tabla de reglas de recurrencia
export default function ListadoRecurrencias({
  cargando,
  recurrencias,
  filtro,
  onLimpiarFiltro,
  onNueva,
  onEditar,
  onCambiarEstado,
  onEliminar,
}) {
  if (cargando) {
    return <Cargando />;
  }

  const visibles = recurrencias.filter((regla) => coincideConFiltro(regla, filtro));

  if (visibles.length > 0) {
    return (
      <TablaRecurrencias
        recurrencias={visibles}
        onEditar={onEditar}
        onCambiarEstado={onCambiarEstado}
        onEliminar={onEliminar}
      />
    );
  }

  if (filtro !== 'todas' && recurrencias.length > 0) {
    const mensaje = MENSAJES_FILTRO[filtro];

    return (
      <EstadoVacio
        titulo={mensaje.titulo}
        descripcion={mensaje.descripcion}
        accion={
          <Boton variante="secundario" onClick={onLimpiarFiltro}>
            Ver todas las reglas
          </Boton>
        }
      />
    );
  }

  return (
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
  );
}
