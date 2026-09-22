export default function Tarjeta({ children, titulo, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {titulo && (
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {titulo}
        </h3>
      )}
      {children}
    </div>
  );
}
