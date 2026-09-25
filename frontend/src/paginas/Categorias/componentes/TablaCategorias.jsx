import { Pencil, Trash2 } from 'lucide-react';
import { obtenerTipoMovimiento } from '../../../compartido/tipos-movimiento';

export default function TablaCategorias({ categorias, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3 text-center">Tipo</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => {
            const tipo = obtenerTipoMovimiento(categoria.tipo);
            const Icono = tipo.icono;

            return (
              <tr
                key={categoria.id}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">{categoria.nombre}</span>
                  {categoria.esSistema && (
                    <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                      Sistema
                    </span>
                  )}
                  {categoria.esPredefinida && !categoria.esSistema && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      Predefinida
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tipo.clases}`}
                  >
                    <Icono className="h-3.5 w-3.5" />
                    {tipo.etiqueta}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {categoria.esPredefinida || categoria.esSistema ? (
                    <span className="text-xs text-slate-400">-------</span>
                  ) : (
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => onEditar(categoria)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-700"
                        aria-label={`Editar la categoria ${categoria.nombre}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEliminar(categoria)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Eliminar la categoria ${categoria.nombre}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
