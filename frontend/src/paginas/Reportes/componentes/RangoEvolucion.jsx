import { useState } from 'react';
import SelectorPeriodo from '../../../componentes/comunes/SelectorPeriodo';
import { periodoDeFecha, rangoEntreMeses, rangoUltimosMeses } from '../../../compartido/fechas';
import { esquemaRangoMeses } from '../../../validaciones/reporte.validacion';

const OPCIONES = [
  { valor: 3, etiqueta: '3 meses' },
  { valor: 6, etiqueta: '6 meses' },
  { valor: 12, etiqueta: '1 año' },
  { valor: 'personalizado', etiqueta: 'Personalizado' },
];

// selector de rango en pastillas, lo comparten la evolucion y el flujo de caja
export default function RangoEvolucion({ onCambiar }) {
  const [opcion, setOpcion] = useState(6);
  // el personalizado arranca con los ultimos 6 meses, igual que la pastilla por defecto
  const [desde, setDesde] = useState(() => periodoDeFecha(rangoUltimosMeses(6).desde));
  const [hasta, setHasta] = useState(() => periodoDeFecha(rangoUltimosMeses(6).hasta));

  function seleccionar(nuevaOpcion) {
    setOpcion(nuevaOpcion);

    if (nuevaOpcion === 'personalizado') {
      aplicar(desde, hasta);
    } else {
      onCambiar(rangoUltimosMeses(nuevaOpcion));
    }
  }

  // validar el par de periodos elegidos y si esta bien, deriva el rango de fechas
  function aplicar(nuevoDesde, nuevaHasta) {
    const validacion = esquemaRangoMeses.safeParse({ desde: nuevoDesde, hasta: nuevaHasta });

    if (validacion.success) {
      onCambiar(rangoEntreMeses(validacion.data.desde, validacion.data.hasta));
    }
  }

  function cambiarDesde(nuevoDesde) {
    setDesde(nuevoDesde);
    aplicar(nuevoDesde, hasta);
  }

  function cambiarHasta(nuevaHasta) {
    setHasta(nuevaHasta);
    aplicar(desde, nuevaHasta);
  }

  const validacion = esquemaRangoMeses.safeParse({ desde, hasta });
  const errorPeriodo = validacion.success ? undefined : validacion.error.issues[0].message;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div
        className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
        role="group"
        aria-label="Rango de fechas de los reportes"
      >
        {OPCIONES.map((opcionActual) => {
          const seleccionada = opcionActual.valor === opcion;

          return (
            <button
              key={opcionActual.valor}
              type="button"
              onClick={() => seleccionar(opcionActual.valor)}
              aria-pressed={seleccionada}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                seleccionada
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {opcionActual.etiqueta}
            </button>
          );
        })}
      </div>

      {opcion === 'personalizado' && (
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-700 text-center">Desde</p>
            <SelectorPeriodo id="desde" periodo={desde} onCambiar={cambiarDesde} />
            {errorPeriodo && <p className="mt-1 text-xs text-red-600">{errorPeriodo}</p>}
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-slate-700 text-center">Hasta</p>
            <SelectorPeriodo id="hasta" periodo={hasta} onCambiar={cambiarHasta} />
          </div>
        </div>
      )}
    </div>
  );
}
