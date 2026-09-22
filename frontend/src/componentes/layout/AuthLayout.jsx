import { Wallet } from 'lucide-react';

// layout compartido para las paginas de autenticacion(login y registro):
// panel lateral y area central para el formulario
export default function AuthLayout({ children, titulo, descripcion }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden flex-1 flex-col justify-between bg-linear-to-br from-violet-700 via-violet-800 to-violet-950 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Finanzas Personales</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold leading-tight">Controla tus finanzas personales</h1>
          <p className="mt-4 text-violet-100">
            Registra ingresos y gastos, planifica presupuestos y alcanza tus metas de ahorro
          </p>
        </div>

        <p className="text-sm text-violet-200">Tus finanzas, ordenadas en un solo lugar</p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">{titulo}</h2>
            <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
