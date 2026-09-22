import { useEffect } from 'react';

export default function Modal({ abierto, onCerrar, titulo, children }) {
  useEffect(() => {
    function manejarEscape(evento) {
      if (evento.key === 'Escape') onCerrar();
    }
    if (abierto) document.addEventListener('keydown', manejarEscape);
    return () => document.removeEventListener('keydown', manejarEscape);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-lg scrollbar-thin scrollbar-thumb-gray-400"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Cerrar"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
