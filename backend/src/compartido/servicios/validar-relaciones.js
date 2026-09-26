import { ErrorApi } from '../middlewares/error.middleware.js';
import { cuentasRepositorio } from '../../modulos/cuentas/cuentas.repositorio.js';
import { categoriasRepositorio } from '../../modulos/categorias/categorias.repositorio.js';

// validar que la cuenta y la categoria existan y que el tipo de la transaccion coincida con el tipo de la categoria;
// esto lo comparten los modulos que crean o editan transacciones (manualmente o generadas por una regla)
export async function validarRelacionesTransaccion(idUsuario, { tipo, idCuenta, idCategoria }) {
  const cuenta = await cuentasRepositorio.buscarCuenta(idUsuario, idCuenta);

  if (!cuenta) {
    throw new ErrorApi('Cuenta no encontrada', 404);
  }

  const categoria = await categoriasRepositorio.buscarCategoria(idUsuario, idCategoria);

  if (!categoria) {
    throw new ErrorApi('Categoria no encontrada', 404);
  }

  if (categoria.tipo !== tipo) {
    throw new ErrorApi(
      `La categoria "${categoria.nombre}" es de tipo ${categoria.tipo === 'INGRESO' ? 'ingreso' : 'gasto'} y no corresponde a una transaccion de tipo ${tipo === 'INGRESO' ? 'ingreso' : 'gasto'}`,
      422,
    );
  }
}
