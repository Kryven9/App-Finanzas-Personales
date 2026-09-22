// extraer el mensaje de error de una respuesta de la api, o uno por defecto si no lo tiene
export function obtenerMensajeError(error, mensajePorDefecto) {
  return error?.response?.data?.error ?? mensajePorDefecto;
}
