import ActividadReciente from './componentes/ActividadReciente';
import ResumenMetas from './componentes/ResumenMetas';
import TarjetaFlujoCaja from './componentes/TarjetaFlujoCaja';
import TarjetaPatrimonio from './componentes/TarjetaPatrimonio';
import TarjetaPresupuestosMes from './componentes/TarjetaPresupuestosMes';
import TopGastos from './componentes/TopGastos';
import { useDashboard } from '../../hooks/useDashboard';

// panel inicial -> versiones resumidas de cada modulo, cada bloque carga por su cuenta
export default function Dashboard() {
  const { patrimonioNeto, cuentas, presupuestos, evolucion, gastos, metas, recientes, cargando } =
    useDashboard();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      <TarjetaPatrimonio
        patrimonioNeto={patrimonioNeto}
        cuentas={cuentas}
        cargando={cargando.patrimonio}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TarjetaPresupuestosMes presupuestos={presupuestos} cargando={cargando.presupuestos} />
        <TarjetaFlujoCaja evolucion={evolucion} cargando={cargando.flujo} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ResumenMetas metas={metas} cargando={cargando.metas} />
        <TopGastos gastos={gastos} cargando={cargando.topGastos} />
      </div>

      <div className="mt-4">
        <ActividadReciente transacciones={recientes} cargando={cargando.recientes} />
      </div>
    </div>
  );
}
