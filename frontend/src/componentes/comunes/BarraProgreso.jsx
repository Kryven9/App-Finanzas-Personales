// barra de progreso reutilizada por presupuestos, metas y el dashboard
export default function BarraProgreso({ porcentaje, clases, className = 'mt-2' }) {
  return (
    <div className={`${className} h-2 overflow-hidden rounded-full bg-slate-100`}>
      <div
        className={`h-full rounded-full ${clases}`}
        style={{ width: `${Math.min(100, porcentaje)}%` }}
      />
    </div>
  );
}
