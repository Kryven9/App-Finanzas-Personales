import { Pencil, Trash2 } from 'lucide-react';
import { formatearMoneda } from '../../../compartido/formato';
import { formatearFecha } from '../../../compartido/fechas';

export default function TablaAportes({ aportes, cargando, onEditar, onEliminar }) {
  if (cargando) {
    return null;
  }

  if (aportes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">Aun no hay aportes en esta meta</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Monto</th>
            <th className="px-4 py-3">Cuenta origen</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aportes.map((aporte) => (
            <tr
              key={aporte.id}
              className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50"
            >
              <td className="px-4 py-3 text-slate-600">{formatearFecha(aporte.fecha)}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">
                {formatearMoneda(aporte.monto)}
              </td>
              <td className="px-4 py-3 text-slate-600">{aporte.cuentaNombre}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEditar(aporte)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
                    aria-label={`Editar el aporte del ${formatearFecha(aporte.fecha)}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEliminar(aporte)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar el aporte del ${formatearFecha(aporte.fecha)}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
