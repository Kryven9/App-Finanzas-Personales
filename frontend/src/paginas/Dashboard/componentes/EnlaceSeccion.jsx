import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// enlace "Ver ..." de la esquina derecha del titulo de cada bloque del dashboard
export default function EnlaceSeccion({ ruta, texto }) {
  return (
    <Link
      to={ruta}
      className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
    >
      {texto}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
