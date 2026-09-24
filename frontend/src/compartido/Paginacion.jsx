import { ChevronLeft, ChevronRight } from 'lucide-react';
import Boton from '../componentes/comunes/Boton';

// paginacion de listados: anterior/siguiente con indicador de pagina;
// se oculta cuando no hay nada que navegar
export default function Paginacion({ pagina, haySiguiente, onCambiarPagina }) {
  if (pagina <= 1 && !haySiguiente) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <Boton
        tamano="sm"
        variante="secundario"
        onClick={() => onCambiarPagina(pagina - 1)}
        disabled={pagina <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Boton>
      <span className="text-sm text-slate-500">Pagina {pagina}</span>
      <Boton
        tamano="sm"
        variante="secundario"
        onClick={() => onCambiarPagina(pagina + 1)}
        disabled={!haySiguiente}
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Boton>
    </div>
  );
}
