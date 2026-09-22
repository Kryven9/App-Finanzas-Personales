import { toast } from 'react-toastify';

// mensajes flotantes de exito o fallo.
export function notificarExito(mensaje) {
  toast.success(mensaje);
}

export function notificarError(mensaje) {
  toast.error(mensaje);
}
