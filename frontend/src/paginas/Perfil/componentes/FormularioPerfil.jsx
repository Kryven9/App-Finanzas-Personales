import { useState } from 'react';
import { UserRoundCog } from 'lucide-react';
import Boton from '../../../componentes/comunes/Boton';
import Input from '../../../componentes/comunes/Input';
import { autenticacionServicio } from '../../../servicios/autenticacion.servicio';
import { useAutenticacionStore } from '../../../estados/autenticacion.store';
import { esquemaActualizarPerfil } from '../../../validaciones/autenticacion.validacion';
import { obtenerErroresPorCampo } from '../../../compartido/errores-zod';
import { obtenerMensajeError } from '../../../compartido/mensajes-error';
import { notificarExito, notificarError } from '../../../compartido/notificaciones';

export default function FormularioPerfil() {
  const usuario = useAutenticacionStore((estado) => estado.usuario);
  const actualizarUsuario = useAutenticacionStore((estado) => estado.actualizarUsuario);
  const [valores, setValores] = useState({
    nombre: usuario?.nombre ?? '',
    correo: usuario?.correo ?? '',
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const validacion = esquemaActualizarPerfil.safeParse(valores);
    if (!validacion.success) {
      setErrores(obtenerErroresPorCampo(validacion.error));
      return;
    }

    setErrores({});
    setCargando(true);

    try {
      const data = await autenticacionServicio.actualizarPerfil(validacion.data);
      actualizarUsuario(data);
      notificarExito('Perfil actualizado');
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo actualizar el perfil'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
      <Input
        etiqueta="Nombre"
        id="nombre"
        name="nombre"
        autoComplete="name"
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />

      <Input
        etiqueta="Correo electronico"
        id="correo"
        name="correo"
        type="email"
        autoComplete="email"
        value={valores.correo}
        onChange={manejarCambio}
        error={errores.correo}
      />

      <Boton type="submit" cargando={cargando} className="self-start">
        <UserRoundCog className="h-4 w-4" />
        Guardar cambios
      </Boton>
    </form>
  );
}
