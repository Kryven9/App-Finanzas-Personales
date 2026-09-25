import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import Select from '../../../componentes/comunes/Select';
import { esquemaAporte } from '../../../validaciones/meta.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';
import { fechaHoy } from '../../../compartido/fechas';

// modal para aportar a una meta y editar
export default function FormularioAporte({ aporte, cuentas, cargando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(
    aporte
      ? {
          monto: String(aporte.monto),
          idCuenta: aporte.idCuenta,
          fecha: aporte.fecha.slice(0, 10),
        }
      : { monto: '', idCuenta: '', fecha: fechaHoy() },
  );
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const datos = {
      monto: valores.monto === '' ? NaN : Number(valores.monto),
      fecha: valores.fecha,
      idCuenta: valores.idCuenta,
    };

    const validacion = esquemaAporte.safeParse(datos);
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
        etiqueta="Monto"
        id="monto"
        name="monto"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={valores.monto}
        onChange={manejarCambio}
        error={errores.monto}
      />

      <Select
        etiqueta="Cuenta de origen"
        id="idCuenta"
        name="idCuenta"
        placeholder="Selecciona una cuenta"
        opciones={cuentas.map((cuenta) => ({ valor: cuenta.id, etiqueta: cuenta.nombre }))}
        value={valores.idCuenta}
        onChange={manejarCambio}
        error={errores.idCuenta}
      />

      <Input
        etiqueta="Fecha"
        id="fecha"
        name="fecha"
        type="date"
        value={valores.fecha}
        onChange={manejarCambio}
        error={errores.fecha}
      />

      <p className="text-xs text-slate-500">
        Se generara automaticamente una transaccion de gasto en la cuenta seleccionada.
      </p>

      <div className="flex justify-end gap-2 pt-2">
        <Boton variante="secundario" type="button" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Boton>
        <Boton type="submit" cargando={cargando}>
          Aportar
        </Boton>
      </div>
    </form>
  );
}
