export default function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600"></span>
      <span className="text-sm">{texto}</span>
    </div>
  );
}
