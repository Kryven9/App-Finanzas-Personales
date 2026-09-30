import { PiggyBank, TriangleAlert } from 'lucide-react';
import Cargando from '../../../componentes/comunes/Cargando';
import EstadoVacio from '../../../componentes/comunes/EstadoVacio';
import Tarjeta from '../../../componentes/comunes/Tarjeta';
import EnlaceSeccion from './EnlaceSeccion';
import { formatearMoneda } from '../../../compartido/formato';
import { obtenerNombreMes, periodoActual } from '../../../compartido/fechas';
import { estadoPresupuesto, porcentajeDe, totalesDe } from '../../../compartido/presupuestos';

const LIMITE_ALERTAS = 3;

// resumen del mes -> total gastado y solo las categorias que necesitan atencion
export default function TarjetaPresupuestosMes({ presupuestos, cargando }) {
  const { mes, anio } = periodoActual();
  const { totalLimite, totalGastado, porcentaje } = totalesDe(presupuestos);

  // una sola pasada por cada presupuesto -> alertas ordenadas de mayor a menor
  const alertas = presupuestos
    .map((presupuesto) => ({ presupuesto, estado: estadoPresupuesto(presupuesto) }))
    .filter(({ estado }) => estado.enAlerta)
    .sort((a, b) => porcentajeDe(b.presupuesto) - porcentajeDe(a.presupuesto))
    .slice(0, LIMITE_ALERTAS);

  return (
    <Tarjeta
      titulo={`Presupuesto de ${obtenerNombreMes(mes)} ${anio}`}
      acciones={<EnlaceSeccion ruta="/presupuestos" texto="Ver todos" />}
    >
      {cargando ? (
        <Cargando />
      ) : presupuestos.length === 0 ? (
        <EstadoVacio
          titulo="Sin presupuestos este mes"
          descripcion="Crea presupuestos para vigilar tu gasto por categoria"
        />
      ) : (
        <>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <PiggyBank className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-slate-500">Presupuestado</span>
                <span className="text-sm font-semibold text-slate-700">
                  {formatearMoneda(totalLimite)}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-slate-500">Gastado</span>
                <span className="text-sm font-semibold text-slate-700">
                  {formatearMoneda(totalGastado)}{' '}
                  <span className="font-medium text-slate-500">({porcentaje}%)</span>
                </span>
              </div>
            </div>
          </div>

          {alertas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {alertas.map(({ presupuesto, estado }) => (
                <span
                  key={presupuesto.id}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${estado.clasesInsignia}`}
                >
                  <TriangleAlert className="h-3.5 w-3.5" />
                  {presupuesto.categoriaNombre}: {estado.porcentaje}%
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </Tarjeta>
  );
}
