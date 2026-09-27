import { useEffect, useState } from 'react';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Cargando from '../../componentes/comunes/Cargando';
import EstadoVacio from '../../componentes/comunes/EstadoVacio';
import FiltroPeriodo from '../../componentes/comunes/FiltroPeriodo';
import GraficoGastosCategoria from '../../componentes/graficos/GraficoGastosCategoria';
import GraficoEvolucion from '../../componentes/graficos/GraficoEvolucion';
import GraficoFlujoCaja from '../../componentes/graficos/GraficoFlujoCaja';
import RangoEvolucion from './componentes/RangoEvolucion';
import { useReportesStore } from '../../estados/reportes.store';
import { periodoActual, rangoUltimosMeses } from '../../compartido/fechas';

export default function Reportes() {
  const { gastos, evolucion, cargandoGastos, cargandoEvolucion, cargarGastos, cargarEvolucion } =
    useReportesStore();
  const [periodoGastos, setPeriodoGastos] = useState(periodoActual());

  // carga inicial -> periodo actual para los gastos y 6 meses para la evolucion
  useEffect(() => {
    cargarGastos(periodoActual());
    cargarEvolucion(rangoUltimosMeses(6));
  }, [cargarGastos, cargarEvolucion]);

  function cambiarPeriodo(nuevoPeriodo) {
    setPeriodoGastos(nuevoPeriodo);
    cargarGastos(nuevoPeriodo);
  }

  const sinMovimientos = evolucion.every((fila) => fila.ingresos === 0 && fila.gastos === 0);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
      </div>

      <Tarjeta className="mb-6" titulo="Gastos por categoria">
        <div className="mb-4 flex justify-start">
          <FiltroPeriodo periodo={periodoGastos} onCambiar={cambiarPeriodo} />
        </div>

        {cargandoGastos ? (
          <Cargando />
        ) : gastos.length === 0 ? (
          <EstadoVacio
            titulo="Sin gastos en este periodo"
            descripcion="No hubo gastos registrados en el mes seleccionado"
          />
        ) : (
          <GraficoGastosCategoria datos={gastos} />
        )}
      </Tarjeta>

      <Tarjeta titulo="Evolucion financiera">
        <div className="mb-4">
          <RangoEvolucion onCambiar={cargarEvolucion} />
        </div>

        {cargandoEvolucion ? (
          <Cargando />
        ) : sinMovimientos ? (
          <EstadoVacio
            titulo="Sin movimientos en este rango"
            descripcion="Registra transacciones dentro del rango seleccionado para ver tu evolucion"
          />
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Ingresos vs gastos</h4>
              <GraficoEvolucion datos={evolucion} />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Flujo de caja mensual</h4>
              <GraficoFlujoCaja datos={evolucion} />
            </div>
          </div>
        )}
      </Tarjeta>
    </div>
  );
}
