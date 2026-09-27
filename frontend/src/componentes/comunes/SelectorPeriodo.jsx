import Select from './Select';
import { MESES, aniosDisponibles } from '../../compartido/fechas';

// par de selects Mes + Año para elegir un periodo, lo usa el filtro de gastos por categoria
// y el rango personalizado de la evolucion
export default function SelectorPeriodo({ id, periodo, onCambiar }) {
  function manejarCambio(evento) {
    // los valores del select llegan como texto -> se convierten en numero
    onCambiar({ ...periodo, [evento.target.name]: Number(evento.target.value) });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        etiqueta="Mes"
        id={`${id}-mes`}
        name="mes"
        opciones={MESES}
        value={periodo.mes}
        onChange={manejarCambio}
      />
      <Select
        etiqueta="Año"
        id={`${id}-anio`}
        name="anio"
        opciones={aniosDisponibles()}
        value={periodo.anio}
        onChange={manejarCambio}
      />
    </div>
  );
}
