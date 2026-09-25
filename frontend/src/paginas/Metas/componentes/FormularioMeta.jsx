import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import { esquemaMeta } from '../../../validaciones/meta.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';

const valoresIniciales = { nombre: '', montoObjetivo: '', fechaObjetivo: '' };

// formulario de meta usado para crear y editar
export default function FormularioMeta({ meta, cargando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(
    meta
      ? {
          nombre: meta.nombre,
          montoObjetivo: String(meta.montoObjetivo),
          fechaObjetivo: meta.fechaObjetivo.slice(0, 10),
        }
      : valoresIniciales,
  );
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const datos = {
      nombre: valores.nombre,
      montoObjetivo: valores.montoObjetivo === '' ? NaN : Number(valores.montoObjetivo),
      fechaObjetivo: valores.fechaObjetivo,
    };

    const validacion = esquemaMeta.safeParse(datos);
    if (!validacion.success) {
      setErrores(obtenerErroresPorCampo(validacion.error));
      return;
    }

    setErrores({});
    await onGuardar(validacion.data);
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
      <Input
        etiqueta="Nombre"
        id="nombre"
        name="nombre"
        placeholder="Ej: Viaje a Japon"
        maxLength={60}
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />

      <Input
        etiqueta="Monto objetivo"
        id="montoObjetivo"
        name="montoObjetivo"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={valores.montoObjetivo}
        onChange={manejarCambio}
        error={errores.montoObjetivo}
      />

      <Input
        etiqueta="Fecha limite"
        id="fechaObjetivo"
        name="fechaObjetivo"
        type="date"
        value={valores.fechaObjetivo}
        onChange={manejarCambio}
        error={errores.fechaObjetivo}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Boton variante="secundario" type="button" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Boton>
        <Boton type="submit" cargando={cargando}>
          Guardar
        </Boton>
      </div>
    </form>
  );
}
