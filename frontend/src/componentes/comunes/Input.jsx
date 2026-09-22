import { forwardRef } from 'react';

const Input = forwardRef(({ etiqueta, error, className = '', id, ...resto }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {etiqueta && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {etiqueta}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-violet-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400
                        ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
        {...resto}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
