import { Pencil, Trash2 } from 'lucide-react';
import { obtenerTipoCuenta } from '../../../compartido/tipos-cuenta';
import { formatearMoneda } from '../../../compartido/formato';

export default function TarjetaCuenta({ cuenta, onEditar, onEliminar }) {
  const tipo = obtenerTipoCuenta(cuenta.tipo);
  const Icono = tipo.icono;
  const saldoNegativo = cuenta.saldoActual < 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Icono className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{cuenta.nombre}</p>
            <span className="text-xs font-medium text-slate-500">{tipo.etiqueta}</span>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={onEditar}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
            aria-label={`Editar la cuenta ${cuenta.nombre}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onEliminar}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Eliminar la cuenta ${cuenta.nombre}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className={`mt-4 text-2xl font-bold ${saldoNegativo ? 'text-red-600' : 'text-slate-900'}`}>
        {formatearMoneda(cuenta.saldoActual)}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {cuenta.transacciones === 0
          ? 'Sin transacciones'
          : `${cuenta.transacciones} ${cuenta.transacciones === 1 ? 'transaccion' : 'transacciones'}`}
      </p>
    </div>
  );
}
