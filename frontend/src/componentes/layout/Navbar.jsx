import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, UserRound, UserRoundCog } from 'lucide-react';
import { useAutenticacionStore } from '../../estados/autenticacion.store';

export default function Navbar({ onToggleSidebar }) {
  const usuario = useAutenticacionStore((estado) => estado.usuario);
  const cerrarSesionStore = useAutenticacionStore((estado) => estado.cerrarSesion);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuReferencia = useRef(null);
  const navegar = useNavigate();

  // cierra el menu si se hace clic fuera de el
  useEffect(() => {
    function manejarClicFuera(evento) {
      if (menuReferencia.current && !menuReferencia.current.contains(evento.target)) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener('mousedown', manejarClicFuera);
    return () => document.removeEventListener('mousedown', manejarClicFuera);
  }, []);

  // el cierre de sesion es client-side: se limpia el store y se redirige al login
  function manejarCerrarSesion() {
    setMenuAbierto(false);
    cerrarSesionStore();
    navegar('/login');
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <button
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        aria-label="Mostrar u ocultar el menu lateral"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        <div ref={menuReferencia} className="relative">
          <button
            onClick={() => setMenuAbierto((previo) => !previo)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Abrir menu de usuario"
          >
            <UserRound className="h-4 w-4" />
            {usuario?.nombre ?? 'Mi cuenta'}
          </button>

          {menuAbierto && (
            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {usuario?.nombre ?? 'Mi cuenta'}
                  </p>
                  <p className="truncate text-xs text-slate-500">{usuario?.correo}</p>
                </div>
              </div>

              <Link
                to="/perfil"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <UserRoundCog className="h-4 w-4" />
                Mi perfil
              </Link>

              <button
                onClick={manejarCerrarSesion}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
