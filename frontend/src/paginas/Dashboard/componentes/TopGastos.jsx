import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import Tarjeta from '../../../componentes/comunes/Tarjeta';
import EnlaceSeccion from './EnlaceSeccion';
import { formatearMoneda } from '../../../compartido/formato';
import { obtenerIconoCategoria } from '../../../compartido/iconos-categoria';

const LIMITE_TOP = 5;

// los gastos ya llegan ordenados de mayor a menor desde el reporte
export default function TopGastos({ gastos, cargando }) {
  const top = gastos.slice(0, LIMITE_TOP);

  return (
    <Tarjeta
      titulo="Top gastos del mes"
      acciones={<EnlaceSeccion ruta="/reportes" texto="Ver reportes" />}
    >
      {cargando ? (
        <Cargando />
      ) : top.length === 0 ? (
        <EstadoVacio
          titulo="Sin gastos este mes"
          descripcion="Tus gastos del mes aparecieran aqui ordenados de mayor a menor"
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {top.map((gasto, indice) => {
            const { icono: Icono } = obtenerIconoCategoria(
              gasto.categoriaNombre,
              gasto.esPredefinida,
            );

            return (
              <li key={gasto.idCategoria} className="flex items-center gap-3">
                <span className="w-4 text-xs font-semibold text-slate-400">{indice + 1}.</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <Icono className="h-4 w-4" />
                </span>
                <span className="flex-1 truncate text-sm font-medium text-slate-700">
                  {gasto.categoriaNombre}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatearMoneda(gasto.total)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Tarjeta>
  );
}
