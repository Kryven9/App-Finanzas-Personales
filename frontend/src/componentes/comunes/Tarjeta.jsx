export default function Tarjeta({ children, titulo, acciones, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {titulo && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{titulo}</h3>
          {acciones}
        </div>
      )}
      {children}
    </div>
  );
}
