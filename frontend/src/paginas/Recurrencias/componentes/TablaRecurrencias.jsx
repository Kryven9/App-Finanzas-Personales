import { Pause, Pencil, Play, Trash2 } from 'lucide-react';
import { formatearMoneda } from '../../../compartido/formato';
import { formatearFecha } from '../../../compartido/fechas';
import { FRECUENCIAS } from '../../../compartido/frecuencias';

const clasesFrecuencia = {
  SEMANAL: 'bg-violet-100 text-violet-700',
  MENSUAL: 'bg-sky-100 text-sky-700',
  ANUAL: 'bg-amber-100 text-amber-700',
};

function etiquetaFrecuencia(frecuencia) {
  return FRECUENCIAS.find((elemento) => elemento.valor === frecuencia)?.etiqueta ?? frecuencia;
}

export default function TablaRecurrencias({ recurrencias, onEditar, onCambiarEstado, onEliminar }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Frecuencia</th>
            <th className="px-4 py-3">Descripcion</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Cuenta</th>
            <th className="px-4 py-3 text-right">Monto</th>
            <th className="px-4 py-3">Proxima generacion</th>
            <th className="px-4 py-3 text-center">Estado</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recurrencias.map((regla) => (
            <tr
              key={regla.id}
              className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${clasesFrecuencia[regla.frecuencia] ?? 'bg-slate-100 text-slate-600'}`}
                >
                  {etiquetaFrecuencia(regla.frecuencia)}
                </span>
              </td>
              <td className="max-w-55 truncate px-4 py-3 text-slate-600">
                {regla.descripcion || '-------'}
              </td>
              <td className="px-4 py-3 text-slate-600">{regla.categoriaNombre}</td>
              <td className="px-4 py-3 text-slate-600">{regla.cuentaNombre}</td>
              <td
                className={`px-4 py-3 text-right font-semibold ${
                  regla.tipo === 'INGRESO' ? 'text-violet-700' : 'text-red-600'
                }`}
              >
                {regla.tipo === 'INGRESO' ? '+' : '-'}
                {formatearMoneda(regla.monto)}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatearFecha(regla.proximaFechaGeneracion)}
              </td>
              <td className="px-4 py-3 text-center">
                {regla.activa ? (
                  <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Activa
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    Inactiva
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => onEditar(regla)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
                    aria-label="Editar la regla"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onCambiarEstado(regla)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
                    aria-label={regla.activa ? 'Desactivar la regla' : 'Activar la regla'}
                  >
                    {regla.activa ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => onEliminar(regla)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Eliminar la regla"
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
