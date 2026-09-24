import { useState } from 'react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import Select from '../../../componentes/comunes/Select';
import { TIPOS_MOVIMIENTO } from '../../../compartido/tipos-movimiento';
import { esquemaCategoria } from '../../../validaciones/categoria.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';

const valoresIniciales = { nombre: '', tipo: '' };

export default function FormularioCategoria({ categoria, cargando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(
    categoria ? { nombre: categoria.nombre, tipo: categoria.tipo } : valoresIniciales,
  );
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const validacion = esquemaCategoria.safeParse(valores);
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
        placeholder="Ej: Viaje"
        maxLength={60}
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />

      <Select
        etiqueta="Tipo de categoria"
        id="tipo"
        name="tipo"
        placeholder="Selecciona un tipo"
        opciones={TIPOS_MOVIMIENTO}
        value={valores.tipo}
        onChange={manejarCambio}
        error={errores.tipo}
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
