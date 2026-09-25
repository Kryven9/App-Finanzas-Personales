import { PiggyBank, Pencil, Repeat, Target, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerTipoMovimiento } from '../../../compartido/tipos-movimiento';
import { formatearMoneda } from '../../../compartido/formato';
import { formatearFecha } from '../../../compartido/fechas';

export default function TablaTransacciones({ transacciones, onEditar, onEliminar }) {
  const navegar = useNavigate();
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Concepto</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Cuenta</th>
            <th className="px-4 py-3 text-center">Tipo</th>
            <th className="px-4 py-3 text-right">Monto</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map((transaccion) => {
            const tipo = obtenerTipoMovimiento(transaccion.tipo);
            const Icono = tipo.icono;

            return (
              <tr
                key={transaccion.id}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-600">
                  {formatearFecha(transaccion.fecha)}
                  {transaccion.idTransaccionRecurrente && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      <Repeat className="h-3 w-3" />
                      Recurrente
                    </span>
                  )}
                  {transaccion.esAporteMeta && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                      <PiggyBank className="h-3 w-3" />
                      Aporte meta
                    </span>
                  )}
                </td>
                <td className="max-w-55 truncate px-4 py-3 text-slate-600">
                  {transaccion.descripcion || '-------'}
                </td>
                <td className="px-4 py-3 text-slate-600">{transaccion.categoriaNombre}</td>
                <td className="px-4 py-3 text-slate-600">{transaccion.cuentaNombre}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tipo.clases}`}
                  >
                    <Icono className="h-3.5 w-3.5" />
                    {tipo.etiqueta}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    transaccion.tipo === 'INGRESO' ? 'text-violet-700' : 'text-red-600'
                  }`}
                >
                  {transaccion.tipo === 'INGRESO' ? '+' : '-'}
                  {formatearMoneda(transaccion.monto)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    {transaccion.esAporteMeta ? (
                      // las transacciones de aportes se administran desde el modulo de metas
                      <button
                        onClick={() => navegar(`/metas/${transaccion.idMetaAporte}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
                        aria-label="Ver la meta asociada a esta transaccion"
                      >
                        <Target className="h-4 w-4" />
                        Ver meta
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onEditar(transaccion)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
                          aria-label={`Editar la transaccion del ${formatearFecha(transaccion.fecha)}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEliminar(transaccion)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Eliminar la transaccion del ${formatearFecha(transaccion.fecha)}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
