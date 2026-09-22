import { forwardRef } from 'react';

const Select = forwardRef(
  ({ etiqueta, error, opciones, placeholder, className = '', id, ...resto }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {etiqueta && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {etiqueta}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={`rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-violet-500 
                        ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
          {...resto}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
