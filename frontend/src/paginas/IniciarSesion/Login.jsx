import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Boton from '../../componentes/comunes/Boton';
import Input from '../../componentes/comunes/Input';
import CampoContrasena from '../../componentes/comunes/CampoContrasena';
import { autenticacionServicio } from '../../servicios/autenticacion.servicio';
import { useAutenticacionStore } from '../../estados/autenticacion.store';
import { esquemaIniciarSesion } from '../../validaciones/autenticacion.validacion';
import { obtenerErroresPorCampo } from '../../compartido/errores-zod';
import { obtenerMensajeError } from '../../compartido/mensajes-error';
import { notificarError } from '../../compartido/notificaciones';

const valoresIniciales = { correo: '', contrasena: '' };

export default function Login() {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const iniciarSesionStore = useAutenticacionStore((estado) => estado.iniciarSesion);
  const navegar = useNavigate();

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previo) => ({ ...previo, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const validacion = esquemaIniciarSesion.safeParse(valores);
    if (!validacion.success) {
      setErrores(obtenerErroresPorCampo(validacion.error));
      return;
    }

    setErrores({});
    setCargando(true);

    try {
      const data = await autenticacionServicio.iniciarSesion(validacion.data);
      iniciarSesionStore(data.token, data.usuario);
      navegar('/dashboard');
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo iniciar sesion'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout
      titulo="Bienvenido de nuevo"
      descripcion="Ingresa tus credenciales para acceder a tus finanzas"
    >
      <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
        <Input
          etiqueta="Correo electronico"
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={valores.correo}
          onChange={manejarCambio}
          error={errores.correo}
        />

        <CampoContrasena
          etiqueta="Contraseña"
          id="contrasena"
          name="contrasena"
          autoComplete="current-password"
          value={valores.contrasena}
          onChange={manejarCambio}
          error={errores.contrasena}
        />

        <Boton type="submit" cargando={cargando} tamano="lg" className="mt-2 w-full">
          <LogIn className="h-4 w-4" />
          Iniciar sesion
        </Boton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-semibold text-violet-700 hover:text-violet-800">
          Registrate
        </Link>
      </p>
    </AuthLayout>
  );
}
