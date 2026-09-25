import { Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../../componentes/comunes/Boton';
import { formatearMoneda } from '../../../compartido/formato';
import { obtenerNombreMes } from '../../../compartido/fechas';
import { calcularProgresoMeta } from '../../../compartido/progreso-meta';

export default function TarjetaMeta({ meta, onAportar }) {
  const navegar = useNavigate();
  const { porcentaje, completada, clasesIcono, clasesBarra } = calcularProgresoMeta(meta);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${clasesIcono}`}
          >
            <Target className="h-5 w-5" />
          </div>
          <p className="font-semibold text-slate-900">{meta.nombre}</p>
        </div>

        {completada && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Completada
          </span>
        )}
      </div>

      <p className="mt-4 text-lg font-bold text-slate-900">
        {formatearMoneda(meta.montoActual)}{' '}
        <span className="text-sm font-medium text-slate-400">
          / {formatearMoneda(meta.montoObjetivo)}
        </span>
      </p>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${clasesBarra}`} style={{ width: `${porcentaje}%` }} />
      </div>
      <p className="mt-1 text-right text-xs font-semibold text-slate-600">{porcentaje}%</p>

      <p className="mt-2 text-xs text-slate-500">
        Meta:{' '}
        {`${obtenerNombreMes(Number(meta.fechaObjetivo.slice(5, 7)))} ${meta.fechaObjetivo.slice(0, 4)}`}
      </p>

      <div className="mt-3 flex justify-end gap-2">
        {!completada && (
          <Boton tamano="sm" onClick={() => onAportar(meta)}>
            Aportar
          </Boton>
        )}
        <Boton tamano="sm" variante="secundario" onClick={() => navegar(`/metas/${meta.id}`)}>
          Ver detalle
        </Boton>
      </div>
    </div>
  );
}
