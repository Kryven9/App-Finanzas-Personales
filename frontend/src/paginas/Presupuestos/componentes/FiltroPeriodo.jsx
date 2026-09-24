import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from '../../../componentes/comunes/Select';
import { MESES, aniosDisponibles, obtenerNombreMes } from '../../../compartido/fechas';

export default function FiltroPeriodo({ periodo, onCambiar }) {
  function manejarCambio(evento) {
    // los valores del select llegan como texto -> se convierten a numero
    onCambiar({ ...periodo, [evento.target.name]: Number(evento.target.value) });
  }

  // avanza o retrocede un mes, cruzando el cambio de año al pasar de diciembre a enero
  function cambiarMes(diferencia) {
    let mes = periodo.mes + diferencia;
    let anio = periodo.anio;

    if (mes < 1) {
      mes = 12;
      anio -= 1;
    } else if (mes > 12) {
      mes = 1;
      anio += 1;
    }

    onCambiar({ mes, anio });
  }

  return (
    <div className="grid items-center gap-4 sm:grid-cols-2">
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <button
          onClick={() => cambiarMes(-1)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-violet-700"
          aria-label="Ir al mes anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="min-w-40 text-center text-sm font-semibold text-slate-900">
          {obtenerNombreMes(periodo.mes)} {periodo.anio}
        </span>

        <button
          onClick={() => cambiarMes(1)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-violet-700"
          aria-label="Ir al mes siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          etiqueta="Mes"
          id="mes"
          name="mes"
          opciones={MESES}
          value={periodo.mes}
          onChange={manejarCambio}
        />

        <Select
          etiqueta="Año"
          id="anio"
          name="anio"
          opciones={aniosDisponibles()}
          value={periodo.anio}
          onChange={manejarCambio}
        />
      </div>
    </div>
  );
}
