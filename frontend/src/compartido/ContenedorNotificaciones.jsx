import { ToastContainer } from 'react-toastify';

// contenedor global para usar mensajes flotantes de exito y fallo
export default function ContenedorNotificaciones() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="dark"
    />
  );
}
