import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import Select from '../../../componentes/comunes/Select';

const valoresVacios = {
  fechaDesde: '',
  fechaHasta: '',
  idCuenta: '',
  idCategoria: '',
  montoMin: '',
  montoMax: '',
};

export default function FiltrosTransaccion({ cuentas, categorias, onFiltrar }) {
  const [valores, setValores] = useState(valoresVacios);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  function aplicar(evento) {
    evento.preventDefault();
    // solo viajan los campos con valor; el resto no filtra
    onFiltrar(Object.fromEntries(Object.entries(valores).filter(([, valor]) => valor !== '')));
  }

  function limpiar() {
    setValores(valoresVacios);
    onFiltrar({});
  }

  return (
    <form onSubmit={aplicar} noValidate>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          etiqueta="Desde"
          id="fechaDesde"
          name="fechaDesde"
          type="date"
          value={valores.fechaDesde}
          onChange={manejarCambio}
        />

        <Input
          etiqueta="Hasta"
          id="fechaHasta"
          name="fechaHasta"
          type="date"
          value={valores.fechaHasta}
          onChange={manejarCambio}
        />

        <Select
          etiqueta="Cuenta"
          id="idCuenta"
          name="idCuenta"
          placeholder="Todas"
          opciones={cuentas.map((cuenta) => ({ valor: cuenta.id, etiqueta: cuenta.nombre }))}
          value={valores.idCuenta}
          onChange={manejarCambio}
        />

        <Select
          etiqueta="Categoria"
          id="idCategoria"
          name="idCategoria"
          placeholder="Todas"
          opciones={categorias.map((categoria) => ({
            valor: categoria.id,
            etiqueta: categoria.nombre,
          }))}
          value={valores.idCategoria}
          onChange={manejarCambio}
        />

        <Input
          etiqueta="Monto minimo"
          id="montoMin"
          name="montoMin"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={valores.montoMin}
          onChange={manejarCambio}
        />

        <Input
          etiqueta="Monto maximo"
          id="montoMax"
          name="montoMax"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={valores.montoMax}
          onChange={manejarCambio}
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Boton variante="fantasma" type="button" onClick={limpiar}>
          Limpiar
        </Boton>
        <Boton type="submit" tamano="sm">
          Aplicar filtros
        </Boton>
      </div>
    </form>
  );
}
