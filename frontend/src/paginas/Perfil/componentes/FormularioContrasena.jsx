import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import CampoContrasena from '../../../componentes/comunes/CampoContrasena';
import { autenticacionServicio } from '../../../servicios/autenticacion.servicio';
import { esquemaCambioContrasena } from '../../../validaciones/autenticacion.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';
import { obtenerMensajeError } from '../../../compartido/mensajes-error';
import { notificarExito, notificarError } from '../../../compartido/notificaciones';

const valoresIniciales = { contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' };

export default function FormularioContrasena() {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const validacion = esquemaCambioContrasena.safeParse(valores);
    if (!validacion.success) {
      setErrores(obtenerErroresPorCampo(validacion.error));
      return;
    }

    setErrores({});
    setCargando(true);

    try {
      await autenticacionServicio.cambiarContrasena(validacion.data);
      setValores(valoresIniciales);
      notificarExito('Contraseña actualizada');
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo cambiar la contraseña'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
      <CampoContrasena
        etiqueta="Contraseña actual"
        id="contrasenaActual"
        name="contrasenaActual"
        autoComplete="current-password"
        value={valores.contrasenaActual}
        onChange={manejarCambio}
        error={errores.contrasenaActual}
      />

      <CampoContrasena
        etiqueta="Contraseña nueva"
        id="nuevaContrasena"
        name="nuevaContrasena"
        autoComplete="new-password"
        placeholder="Minimo 8 caracteres"
        value={valores.nuevaContrasena}
        onChange={manejarCambio}
        error={errores.nuevaContrasena}
      />

      <CampoContrasena
        etiqueta="Confirmar contraseña nueva"
        id="confirmarContrasena"
        name="confirmarContrasena"
        autoComplete="new-password"
        value={valores.confirmarContrasena}
        onChange={manejarCambio}
        error={errores.confirmarContrasena}
      />

      <Boton type="submit" cargando={cargando} className="self-start">
        <KeyRound className="h-4 w-4" />
        Cambiar contraseña
      </Boton>
    </form>
  );
}
