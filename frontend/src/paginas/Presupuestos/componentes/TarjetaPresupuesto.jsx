import { Pencil, Trash2 } from 'lucide-react';
import { formatearMoneda } from '../../../compartido/formato';
import { obtenerNombreMes } from '../../../compartido/fechas';
import { obtenerIconoCategoria } from '../../../compartido/iconos-categoria';

// umbrales de advertencia del presupuesto -> verde < 80%, ambar 80-99%, rojo >= 100%
const PORCENTAJE_ADVERTENCIA = 80;
const PORCENTAJE_EXCEDIDO = 100;

export default function TarjetaPresupuesto({ presupuesto, onEditar, onEliminar }) {
  const porcentajeExacto = (presupuesto.gastoReal / presupuesto.montoLimite) * 100;
  const porcentaje = Math.round(porcentajeExacto);
  const superado = porcentajeExacto >= PORCENTAJE_EXCEDIDO;
  const enAdvertencia = !superado && porcentajeExacto >= PORCENTAJE_ADVERTENCIA;

  // verde -> disponible, ambar -> cerca del limite, rojo -> superado
  const clasesEstado = superado
    ? 'text-red-600'
    : enAdvertencia
      ? 'text-amber-600'
      : 'text-emerald-600';
  const clasesBarra = superado ? 'bg-red-500' : enAdvertencia ? 'bg-amber-500' : 'bg-emerald-500';

  const { icono: Icono } = obtenerIconoCategoria(
    presupuesto.categoriaNombre,
    presupuesto.esPredefinida,
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Icono className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{presupuesto.categoriaNombre}</p>
            <span className="text-xs font-medium text-slate-500">
              {obtenerNombreMes(presupuesto.mes)} {presupuesto.anio}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEditar(presupuesto)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
            aria-label={`Editar el presupuesto de ${presupuesto.categoriaNombre}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEliminar(presupuesto)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Eliminar el presupuesto de ${presupuesto.categoriaNombre}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-500">Gastado:</span>
          <span className={`font-bold ${clasesEstado}`}>
            {formatearMoneda(presupuesto.gastoReal)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-500">Presupuesto:</span>
          <span className="text-slate-700">{formatearMoneda(presupuesto.montoLimite)}</span>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${clasesBarra}`}
          style={{ width: `${Math.min(100, porcentaje)}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs font-medium ${clasesEstado}`}>
          {superado ? 'Presupuesto superado' : enAdvertencia ? 'Cerca del limite' : 'Disponible'}
        </span>
        <span className="text-xs font-semibold text-slate-600">{porcentaje}%</span>
      </div>
    </div>
  );
}
