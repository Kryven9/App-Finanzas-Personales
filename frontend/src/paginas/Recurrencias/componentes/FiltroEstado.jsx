const OPCIONES = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'activas', etiqueta: 'Activas' },
  { valor: 'pausadas', etiqueta: 'Pausadas' },
];

// filtro de estado del listado de reglas
export default function FiltroEstado({ recurrencias, valor, onCambiar }) {
  const conteos = {
    todas: recurrencias.length,
    activas: recurrencias.filter((regla) => regla.activa).length,
    pausadas: recurrencias.filter((regla) => !regla.activa).length,
  };

  return (
    <div
      className="mb-4 inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
      role="group"
      aria-label="Filtrar reglas por estado"
    >
      {OPCIONES.map((opcion) => {
        const seleccionada = opcion.valor === valor;

        return (
          <button
            key={opcion.valor}
            type="button"
            onClick={() => onCambiar(opcion.valor)}
            aria-pressed={seleccionada}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              seleccionada
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {opcion.etiqueta}
            <span className={`text-xs ${seleccionada ? 'text-violet-100' : 'text-slate-400'}`}>
              {conteos[opcion.valor]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
