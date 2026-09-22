export default function EstadoVacio({ titulo, descripcion, accion }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-12 text-center">
      <p className="text-sm font-medium text-slate-600">{titulo}</p>
      {descripcion && <p className="text-xs text-slate-400">{descripcion}</p>}
      {accion && <div className="mt-2">{accion}</div>}
    </div>
  );
}
