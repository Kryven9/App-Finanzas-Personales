import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import Select from '../../../componentes/comunes/Select';
import { esquemaPresupuesto } from '../../../validaciones/presupuesto.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';
import { MESES, aniosDisponibles } from '../../../compartido/fechas';

export default function FormularioPresupuesto({
  presupuesto,
  periodo,
  categorias,
  cargando,
  onGuardar,
  onCancelar,
}) {
  const [valores, setValores] = useState(
    presupuesto
      ? {
          idCategoria: presupuesto.idCategoria,
          montoLimite: String(presupuesto.montoLimite),
          mes: presupuesto.mes,
          anio: presupuesto.anio,
        }
      : { idCategoria: '', montoLimite: '', mes: periodo.mes, anio: periodo.anio },
  );
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const datos = {
      idCategoria: valores.idCategoria,
      montoLimite: valores.montoLimite === '' ? NaN : Number(valores.montoLimite),
      mes: Number(valores.mes),
      anio: Number(valores.anio),
    };

    const validacion = esquemaPresupuesto.safeParse(datos);
    if (!validacion.success) {
      setErrores(obtenerErroresPorCampo(validacion.error));
      return;
    }

    setErrores({});
    // en edicion solo viaja el monto limite -> la categoria y el periodo quedan fijos
    const datosParaEnviar = presupuesto
      ? { montoLimite: validacion.data.montoLimite }
      : validacion.data;

    await onGuardar(datosParaEnviar);
  }

  // solo se presupuestan categorias de tipo gasto
  const categoriasGasto = categorias.filter((categoria) => categoria.tipo === 'GASTO');

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
      <Select
        etiqueta="Categoria"
        id="idCategoria"
        name="idCategoria"
        placeholder="Selecciona una categoria"
        opciones={categoriasGasto.map((categoria) => ({
          valor: categoria.id,
          etiqueta: categoria.nombre,
        }))}
        value={valores.idCategoria}
        onChange={manejarCambio}
        disabled={Boolean(presupuesto)}
        error={errores.idCategoria}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          etiqueta="Mes"
          id="mes"
          name="mes"
          placeholder="Selecciona un mes"
          opciones={MESES}
          value={valores.mes}
          onChange={manejarCambio}
          disabled={Boolean(presupuesto)}
          error={errores.mes}
        />

        <Select
          etiqueta="Año"
          id="anio"
          name="anio"
          placeholder="Selecciona un año"
          opciones={aniosDisponibles()}
          value={valores.anio}
          onChange={manejarCambio}
          disabled={Boolean(presupuesto)}
          error={errores.anio}
        />
      </div>

      <Input
        etiqueta="Monto limite"
        id="montoLimite"
        name="montoLimite"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={valores.montoLimite}
        onChange={manejarCambio}
        error={errores.montoLimite}
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
