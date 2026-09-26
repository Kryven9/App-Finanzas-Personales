import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Modal from '../../../componentes/comunes/Modal';

// modal de confirmacion para eliminar una regla; si ya genero transacciones ofrece conservarlas (quedan
// como independientes) o eliminarlas junto con la regla
export default function ModalEliminarRecurrencia({ regla, cargando, onEliminar, onCerrar }) {
  // cual de las dos opciones de eliminacion se esta ejecutando
  const [accionEliminando, setAccionEliminando] = useState(null);
  const tieneGeneradas = (regla?.transaccionesGeneradas ?? 0) > 0;

  // eliminarGeneradas = false -> conserva las transacciones generadas
  async function confirmar(eliminarGeneradas) {
    setAccionEliminando(eliminarGeneradas ? 'generadas' : 'regla');
    await onEliminar(eliminarGeneradas);
    setAccionEliminando(null);
  }

  return (
    <Modal abierto={Boolean(regla)} onCerrar={onCerrar} titulo="Eliminar regla">
      <p className="mb-4 text-sm text-slate-600">
        ¿Seguro que deseas eliminar esta regla? Esta accion no se puede deshacer.
      </p>

      {tieneGeneradas && (
        <p className="mb-6 text-sm text-slate-600">
          Ya genero{' '}
          <span className="font-semibold text-slate-900">{regla.transaccionesGeneradas}</span>{' '}
          transacciones. Puedes conservarlas (quedaran como transacciones independientes) o
          eliminarlas junto con la regla.
        </p>
      )}

      <div className="flex flex-col justify-end gap-2 pt-2 sm:flex-row">
        <Boton variante="secundario" onClick={onCerrar} disabled={cargando}>
          Cancelar
        </Boton>

        {tieneGeneradas ? (
          <Boton
            variante="secundario"
            onClick={() => confirmar(false)}
            cargando={cargando && accionEliminando === 'regla'}
            disabled={cargando && accionEliminando !== 'regla'}
          >
            Solo eliminar la regla
          </Boton>
        ) : (
          <Boton
            variante="peligro"
            onClick={() => confirmar(false)}
            cargando={cargando && accionEliminando === 'regla'}
            disabled={cargando && accionEliminando !== 'regla'}
          >
            Eliminar regla
          </Boton>
        )}

        {tieneGeneradas && (
          <Boton
            variante="peligro"
            onClick={() => confirmar(true)}
            cargando={cargando && accionEliminando === 'generadas'}
            disabled={cargando && accionEliminando !== 'generadas'}
          >
            Eliminar regla y transacciones
          </Boton>
        )}
      </div>
    </Modal>
  );
}
