import { useEffect, useState } from 'react';
import Tarjeta from '../../componentes/comunes/Tarjeta';
import Cargando from '../../componentes/comunes/Cargando';
import FormularioPerfil from './componentes/FormularioPerfil';
import FormularioContrasena from './componentes/FormularioContrasena';
import { autenticacionServicio } from '../../servicios/autenticacion.servicio';
import { useAutenticacionStore } from '../../estados/autenticacion.store';
import { obtenerMensajeError } from '../../compartido/mensajes-error';
import { notificarError } from '../../compartido/notificaciones';

export default function Perfil() {
  const usuario = useAutenticacionStore((estado) => estado.usuario);
  const actualizarUsuario = useAutenticacionStore((estado) => estado.actualizarUsuario);
  const [cargando, setCargando] = useState(true);

  // sincroniza los datos del perfil con lo guardado en la base de datos
  useEffect(() => {
    async function cargarPerfil() {
      try {
        const data = await autenticacionServicio.obtenerPerfil();
        actualizarUsuario(data);
      } catch (error) {
        notificarError(obtenerMensajeError(error, 'No se pudo cargar el perfil'));
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, [actualizarUsuario]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Mi perfil</h1>

      {cargando ? (
        <Cargando />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Tarjeta titulo="Datos personales">
            <FormularioPerfil key={usuario?.fechaActualizacion} />
          </Tarjeta>

          <Tarjeta titulo="Cambiar contraseña">
            <FormularioContrasena />
          </Tarjeta>
        </div>
      )}
    </div>
  );
}
