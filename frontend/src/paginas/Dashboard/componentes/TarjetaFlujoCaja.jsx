import { lazy, Suspense } from 'react';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import Tarjeta from '../../../componentes/comunes/Tarjeta';
import EnlaceSeccion from './EnlaceSeccion';

// el grafico se carga bajo demanda para no pesar en el bundle principal
const GraficoFlujoCaja = lazy(() => import('../../../componentes/graficos/GraficoFlujoCaja'));

// flujo de caja de los ultimos meses de manera reducida
export default function TarjetaFlujoCaja({ evolucion, cargando }) {
  const sinMovimientos = evolucion.every((fila) => fila.ingresos === 0 && fila.gastos === 0);

  return (
    <Tarjeta
      titulo="Flujo de caja"
      acciones={<EnlaceSeccion ruta="/reportes" texto="Ver reportes" />}
    >
      {cargando ? (
        <Cargando />
      ) : sinMovimientos ? (
        <EstadoVacio
          titulo="Sin movimientos"
          descripcion="Registra transacciones para ver tu flujo de caja"
        />
      ) : (
        <Suspense fallback={<Cargando />}>
          <GraficoFlujoCaja datos={evolucion} compacto />
        </Suspense>
      )}
    </Tarjeta>
  );
}
