import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRoundPlus } from 'lucide-react';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Boton from '../../componentes/comunes/Boton';
import Input from '../../componentes/comunes/Input';
import CampoContrasena from '../../componentes/comunes/CampoContrasena';
import { autenticacionServicio } from '../../servicios/autenticacion.servicio';
import { useAutenticacionStore } from '../../estados/autenticacion.store';
import { esquemaRegistro } from '../../validaciones/autenticacion.validacion';
import { obtenerErroresPorCampo } from '../../compartido/errores-zod';
import { obtenerMensajeError } from '../../compartido/mensajes-error';
import { notificarError } from '../../compartido/notificaciones';

const valoresIniciales = { nombre: '', correo: '', contrasena: '', confirmarContrasena: '' };

export default function Registro() {
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

    const validacion = esquemaRegistro.safeParse(valores);
    if (!validacion.success) {
      setErrores(obtenerErroresPorCampo(validacion.error));
      return;
    }

    setErrores({});
    setCargando(true);

    try {
      const data = await autenticacionServicio.registrar(validacion.data);
      iniciarSesionStore(data.token, data.usuario);
      navegar('/dashboard');
    } catch (error) {
      notificarError(obtenerMensajeError(error, 'No se pudo crear la cuenta'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout
      titulo="Crea tu cuenta"
      descripcion="Empieza a controlar tus finanzas personales gratis"
    >
      <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
        <Input
          etiqueta="Nombre"
          id="nombre"
          name="nombre"
          autoComplete="name"
          placeholder="Tu nombre"
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
          placeholder="tu@correo.com"
          value={valores.correo}
          onChange={manejarCambio}
          error={errores.correo}
        />

        <CampoContrasena
          etiqueta="Contraseña"
          id="contrasena"
          name="contrasena"
          autoComplete="new-password"
          placeholder="Minimo 8 caracteres"
          value={valores.contrasena}
          onChange={manejarCambio}
          error={errores.contrasena}
        />

        <CampoContrasena
          etiqueta="Confirmar contraseña"
          id="confirmarContrasena"
          name="confirmarContrasena"
          autoComplete="new-password"
          value={valores.confirmarContrasena}
          onChange={manejarCambio}
          error={errores.confirmarContrasena}
        />

        <Boton type="submit" cargando={cargando} tamano="lg" className="mt-2 w-full">
          <UserRoundPlus className="h-4 w-4" />
          Registrarse
        </Boton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-violet-700 hover:text-violet-800">
          Inicia sesion
        </Link>
      </p>
    </AuthLayout>
  );
}
