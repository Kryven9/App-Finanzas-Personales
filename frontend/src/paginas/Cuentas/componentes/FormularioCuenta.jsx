import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import Select from '../../../componentes/comunes/Select';
import { TIPOS_CUENTA } from '../../../compartido/tipos-cuenta';
import { esquemaCuenta } from '../../../validaciones/cuenta.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';

const valoresIniciales = { nombre: '', tipo: '', saldoInicial: '' };

export default function FormularioCuenta({ cuenta, cargando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(
    cuenta
      ? { nombre: cuenta.nombre, tipo: cuenta.tipo, saldoInicial: String(cuenta.saldoInicial) }
      : valoresIniciales,
  );
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    // el saldo inicial viaja como texto en el input -> se convierte antes de validar
    const datos = {
      nombre: valores.nombre,
      tipo: valores.tipo,
      saldoInicial: valores.saldoInicial === '' ? NaN : Number(valores.saldoInicial),
    };

    const validacion = esquemaCuenta.safeParse(datos);
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
        placeholder="Ej: Banco principal"
        maxLength={60}
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />

      <Select
        etiqueta="Tipo de cuenta"
        id="tipo"
        name="tipo"
        placeholder="Selecciona un tipo"
        opciones={TIPOS_CUENTA.map(({ valor, etiqueta }) => ({ valor, etiqueta }))}
        value={valores.tipo}
        onChange={manejarCambio}
        error={errores.tipo}
      />

      <Input
        etiqueta="Saldo inicial"
        id="saldoInicial"
        name="saldoInicial"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        value={valores.saldoInicial}
        onChange={manejarCambio}
        error={errores.saldoInicial}
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
