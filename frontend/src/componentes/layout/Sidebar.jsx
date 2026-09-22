import { NavLink } from 'react-router-dom';
import { BarChart3, CreditCard, LayoutDashboard, PiggyBank, Receipt, Target } from 'lucide-react';

const enlaces = [
  {
    ruta: '/dashboard',
    etiqueta: 'Dashboard',
    icono: <LayoutDashboard className="h-4 w-4 shrink-0" />,
  },
  {
    ruta: '/cuentas',
    etiqueta: 'Cuentas',
    icono: <CreditCard className="h-4 w-4 shrink-0" />,
  },
  {
    ruta: '/transacciones',
    etiqueta: 'Transacciones',
    icono: <Receipt className="h-4 w-4 shrink-0" />,
  },
  {
    ruta: '/presupuestos',
    etiqueta: 'Presupuestos',
    icono: <PiggyBank className="h-4 w-4 shrink-0" />,
  },
  {
    ruta: '/metas',
    etiqueta: 'Metas de ahorro',
    icono: <Target className="h-4 w-4 shrink-0" />,
  },
  {
    ruta: '/reportes',
    etiqueta: 'Reportes',
    icono: <BarChart3 className="h-4 w-4 shrink-0" />,
  },
];

export default function Sidebar({ abierto, onCerrar }) {
  function cerrarSiMobile() {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      onCerrar?.();
    }
  }

  return (
    <>
      {abierto && (
        <div
          onClick={onCerrar}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col bg-neutral-950 transition-all duration-300 lg:static lg:z-auto ${abierto ? 'w-56 translate-x-0' : 'w-14 -translate-x-full lg:w-14 lg:translate-x-0'}`}
      >
        <div
          className={`flex h-14 shrink-0 items-center border-b border-white/10 ${abierto ? 'px-4' : 'justify-center'}`}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600">
            <span className="text-sm font-bold text-white">$</span>
          </div>
          {abierto && (
            <span className="ml-2.5 text-sm font-semibold text-white">Finanzas Personales</span>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              title={enlace.etiqueta}
              onClick={cerrarSiMobile}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-colors ${abierto ? 'gap-3 px-3 py-2' : 'justify-center p-2.5'} ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'text-violet-400 hover:bg-violet-600/15 hover:text-violet-300'
                }`
              }
            >
              {enlace.icono}
              {abierto && enlace.etiqueta}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
