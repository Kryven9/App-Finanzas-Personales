import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import Select from '../../../componentes/comunes/Select';
import { TIPOS_MOVIMIENTO } from '../../../compartido/tipos-movimiento';
import { esquemaTransaccion } from '../../../validaciones/transaccion.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';
import { fechaHoy } from '../../../compartido/fechas';

export default function FormularioTransaccion({
  transaccion,
  cuentas,
  categorias,
  cargando,
  onGuardar,
  onCancelar,
}) {
  const [valores, setValores] = useState(
    transaccion
      ? {
          tipo: transaccion.tipo,
          monto: String(transaccion.monto),
          fecha: transaccion.fecha.slice(0, 10),
          idCuenta: transaccion.idCuenta,
          idCategoria: transaccion.idCategoria,
          descripcion: transaccion.descripcion ?? '',
        }
      : {
          tipo: 'GASTO',
          monto: '',
          fecha: fechaHoy(),
          idCuenta: '',
          idCategoria: '',
          descripcion: '',
        },
  );
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  // al cambiar el tipo, una categoria de otro tipo deja de ser valida
  function manejarCambioTipo(evento) {
    const tipo = evento.target.value;
    setValores((previo) => {
      const categoriaInvalida = categorias.some(
        (categoria) => categoria.id === previo.idCategoria && categoria.tipo !== tipo,
      );
      return { ...previo, tipo, idCategoria: categoriaInvalida ? '' : previo.idCategoria };
    });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const datos = {
      tipo: valores.tipo,
      monto: valores.monto === '' ? NaN : Number(valores.monto),
      fecha: valores.fecha,
      idCuenta: valores.idCuenta,
      idCategoria: valores.idCategoria,
      descripcion: valores.descripcion || undefined,
    };

    const validacion = esquemaTransaccion.safeParse(datos);
    if (!validacion.success) {
      setErrores(obtenerErroresPorCampo(validacion.error));
      return;
    }

    setErrores({});
    // en edicion el tipo no viaja -> el backend conserva el tipo actual
    const datosParaEnviar = transaccion
      ? {
          monto: validacion.data.monto,
          fecha: validacion.data.fecha,
          idCuenta: validacion.data.idCuenta,
          idCategoria: validacion.data.idCategoria,
          descripcion: validacion.data.descripcion,
        }
      : validacion.data;

    await onGuardar(datosParaEnviar);
  }

  const categoriasPorTipo = categorias.filter((categoria) => categoria.tipo === valores.tipo);

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          etiqueta="Tipo"
          id="tipo"
          name="tipo"
          placeholder="Selecciona un tipo"
          opciones={TIPOS_MOVIMIENTO}
          value={valores.tipo}
          onChange={manejarCambioTipo}
          disabled={Boolean(transaccion)}
          error={errores.tipo}
        />

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
      </div>

      <Input
        etiqueta="Fecha"
        id="fecha"
        name="fecha"
        type="date"
        value={valores.fecha}
        onChange={manejarCambio}
        error={errores.fecha}
      />

      <Select
        etiqueta="Cuenta"
        id="idCuenta"
        name="idCuenta"
        placeholder="Selecciona una cuenta"
        opciones={cuentas.map((cuenta) => ({ valor: cuenta.id, etiqueta: cuenta.nombre }))}
        value={valores.idCuenta}
        onChange={manejarCambio}
        error={errores.idCuenta}
      />

      <Select
        etiqueta="Categoria"
        id="idCategoria"
        name="idCategoria"
        placeholder="Selecciona una categoria"
        opciones={categoriasPorTipo.map((categoria) => ({
          valor: categoria.id,
          etiqueta: categoria.nombre,
        }))}
        value={valores.idCategoria}
        onChange={manejarCambio}
        error={errores.idCategoria}
      />

      <Input
        etiqueta="Descripcion (opcional)"
        id="descripcion"
        name="descripcion"
        placeholder="Ej: Compra semanal"
        maxLength={255}
        value={valores.descripcion}
        onChange={manejarCambio}
        error={errores.descripcion}
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
