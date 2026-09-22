const clasesVariante = {
  primario: 'bg-violet-600 text-white hover:bg-violet-700 disabled:bg-violet-300',
  secundario: 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:text-slate-400',
  peligro: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  fantasma: 'bg-transparent text-slate-600 hover:bg-slate-100 disabled:text-slate-300',
};

const clasesTamano = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Boton({
  children,
  variante = 'primario',
  tamano = 'md',
  cargando = false,
  disabled = false,
  className = '',
  ...resto
}) {
  return (
    <button
      disabled={disabled || cargando}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${clasesVariante[variante]} ${clasesTamano[tamano]} ${className}`}
      {...resto}
    >
      {cargando && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
