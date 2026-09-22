// convertir los errores de zod a un objeto { campo: mensaje } para mostrarlos en el formulario
export function obtenerErroresPorCampo(error) {
  const errores = {};

  for (const problema of error.issues) {
    const campo = problema.path[0];
    if (campo && !errores[campo]) {
      errores[campo] = problema.message;
    }
  }

  return errores;
}
