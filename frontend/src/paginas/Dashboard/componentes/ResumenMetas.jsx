import BarraProgreso from '../../../componentes/comunes/BarraProgreso';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import Tarjeta from '../../../componentes/comunes/Tarjeta';
import EnlaceSeccion from './EnlaceSeccion';
import { formatearMoneda } from '../../../compartido/formato';
import { calcularProgresoMeta } from '../../../compartido/progreso-meta';

const LIMITE_METAS = 3;

// primero las mas cercanas a completarse
const porProgreso = (a, b) => b.porcentaje - a.porcentaje;

export default function ResumenMetas({ metas, cargando }) {
  const relevantes = metas
    .map((meta) => ({ meta, ...calcularProgresoMeta(meta) }))
    .sort(porProgreso)
    .slice(0, LIMITE_METAS);

  return (
    <Tarjeta titulo="Metas de ahorro" acciones={<EnlaceSeccion ruta="/metas" texto="Ver todas" />}>
      {cargando ? (
        <Cargando />
      ) : relevantes.length === 0 ? (
        <EstadoVacio
          titulo="Aun no tienes metas"
          descripcion="Define un objetivo para empezar a ahorrar"
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {relevantes.map(({ meta, porcentaje, completada, clasesBarra }) => (
            <li key={meta.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-medium text-slate-700">{meta.nombre}</span>
                <span
                  className={`shrink-0 text-xs font-semibold ${
                    completada ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                >
                  {completada ? 'Completada' : `${porcentaje}%`}
                </span>
              </div>

              <BarraProgreso porcentaje={porcentaje} clases={clasesBarra} className="mt-1.5" />

              <p className="mt-1 text-xs text-slate-500">
                {formatearMoneda(meta.montoActual)} de {formatearMoneda(meta.montoObjetivo)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );
}
